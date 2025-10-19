# Milestone Completion Design Document

## Overview

This design document outlines the implementation strategy for completing all remaining features from Milestones 4 and 5, focusing on the forum/community system, comprehensive testing suite, and advanced export features. The design emphasizes scalability, maintainability, and seamless integration with the existing BudgetWise application.

## Architecture

### System Architecture Overview
```
BudgetWise Application
├── Existing Core System
│   ├── Authentication & User Management ✅
│   ├── Transaction Management ✅
│   ├── Financial Analytics ✅
│   └── Basic Export System ✅
├── New Forum System
│   ├── Forum Backend (Spring Boot)
│   ├── Forum Frontend (React)
│   └── Real-time Features (WebSocket)
├── Enhanced Testing Framework
│   ├── Frontend Tests (Jest + RTL)
│   ├── Backend Tests (JUnit + Mockito)
│   └── E2E Tests (Cypress/Playwright)
└── Advanced Export System
    ├── Excel Generation (Apache POI)
    ├── Email Service Integration
    └── Scheduled Reports
```

### Data Flow Architecture
```
User Interaction → Forum Components → API Layer → Service Layer → Repository Layer → Database
                                   ↓
Real-time Updates ← WebSocket ← Event System ← Business Logic
```

## Components and Interfaces

### 1. Forum System Backend

#### **Forum Entity Models**
```java
// Topic.java
@Entity
@Table(name = "forum_topics")
public class Topic {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    
    @Column(nullable = false)
    private String title;
    
    @Column(columnDefinition = "TEXT")
    private String content;
    
    @Enumerated(EnumType.STRING)
    private TopicCategory category;
    
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "author_id")
    private User author;
    
    @OneToMany(mappedBy = "topic", cascade = CascadeType.ALL)
    private List<Reply> replies = new ArrayList<>();
    
    @OneToMany(mappedBy = "topic", cascade = CascadeType.ALL)
    private List<TopicLike> likes = new ArrayList<>();
    
    @Column(name = "created_at")
    private LocalDateTime createdAt;
    
    @Column(name = "updated_at")
    private LocalDateTime updatedAt;
    
    @Column(name = "is_pinned")
    private Boolean isPinned = false;
    
    @Column(name = "is_locked")
    private Boolean isLocked = false;
    
    @Column(name = "view_count")
    private Long viewCount = 0L;
}

// Reply.java
@Entity
@Table(name = "forum_replies")
public class Reply {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    
    @Column(columnDefinition = "TEXT", nullable = false)
    private String content;
    
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "topic_id")
    private Topic topic;
    
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "author_id")
    private User author;
    
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "parent_reply_id")
    private Reply parentReply;
    
    @OneToMany(mappedBy = "parentReply", cascade = CascadeType.ALL)
    private List<Reply> childReplies = new ArrayList<>();
    
    @OneToMany(mappedBy = "reply", cascade = CascadeType.ALL)
    private List<ReplyLike> likes = new ArrayList<>();
    
    @Column(name = "created_at")
    private LocalDateTime createdAt;
    
    @Column(name = "updated_at")
    private LocalDateTime updatedAt;
}

// TopicCategory Enum
public enum TopicCategory {
    BUDGETING("Budgeting & Planning"),
    SAVINGS("Savings & Goals"),
    INVESTMENT("Investment & Growth"),
    DEBT_MANAGEMENT("Debt Management"),
    INSURANCE("Insurance & Protection"),
    TAX_PLANNING("Tax Planning"),
    GENERAL_TIPS("General Tips"),
    SUCCESS_STORIES("Success Stories");
}
```

#### **Forum Repository Layer**
```java
// TopicRepository.java
@Repository
public interface TopicRepository extends JpaRepository<Topic, Long> {
    List<Topic> findByCategory(TopicCategory category, Pageable pageable);
    List<Topic> findByTitleContainingIgnoreCase(String title, Pageable pageable);
    List<Topic> findByAuthor(User author, Pageable pageable);
    
    @Query("SELECT t FROM Topic t LEFT JOIN t.likes l GROUP BY t ORDER BY COUNT(l) DESC")
    List<Topic> findMostLikedTopics(Pageable pageable);
    
    @Query("SELECT t FROM Topic t ORDER BY t.createdAt DESC")
    List<Topic> findRecentTopics(Pageable pageable);
    
    @Query("SELECT t FROM Topic t LEFT JOIN t.replies r GROUP BY t ORDER BY COUNT(r) DESC")
    List<Topic> findMostActiveTopics(Pageable pageable);
}

// ReplyRepository.java
@Repository
public interface ReplyRepository extends JpaRepository<Reply, Long> {
    List<Reply> findByTopicOrderByCreatedAtAsc(Topic topic);
    List<Reply> findByAuthor(User author, Pageable pageable);
    Long countByTopic(Topic topic);
    
    @Query("SELECT r FROM Reply r WHERE r.parentReply IS NULL AND r.topic = :topic ORDER BY r.createdAt ASC")
    List<Reply> findTopLevelRepliesByTopic(@Param("topic") Topic topic);
}
```

#### **Forum Service Layer**
```java
// ForumService.java
@Service
@Transactional
public class ForumService {
    
    @Autowired
    private TopicRepository topicRepository;
    
    @Autowired
    private ReplyRepository replyRepository;
    
    @Autowired
    private NotificationService notificationService;
    
    public Topic createTopic(CreateTopicRequest request, User author) {
        Topic topic = new Topic();
        topic.setTitle(request.getTitle());
        topic.setContent(request.getContent());
        topic.setCategory(request.getCategory());
        topic.setAuthor(author);
        topic.setCreatedAt(LocalDateTime.now());
        topic.setUpdatedAt(LocalDateTime.now());
        
        Topic savedTopic = topicRepository.save(topic);
        
        // Send notifications to interested users
        notificationService.notifyNewTopic(savedTopic);
        
        return savedTopic;
    }
    
    public Reply createReply(CreateReplyRequest request, User author) {
        Topic topic = topicRepository.findById(request.getTopicId())
            .orElseThrow(() -> new EntityNotFoundException("Topic not found"));
            
        if (topic.getIsLocked()) {
            throw new IllegalStateException("Cannot reply to locked topic");
        }
        
        Reply reply = new Reply();
        reply.setContent(request.getContent());
        reply.setTopic(topic);
        reply.setAuthor(author);
        reply.setCreatedAt(LocalDateTime.now());
        reply.setUpdatedAt(LocalDateTime.now());
        
        if (request.getParentReplyId() != null) {
            Reply parentReply = replyRepository.findById(request.getParentReplyId())
                .orElseThrow(() -> new EntityNotFoundException("Parent reply not found"));
            reply.setParentReply(parentReply);
        }
        
        Reply savedReply = replyRepository.save(reply);
        
        // Update topic's updated timestamp
        topic.setUpdatedAt(LocalDateTime.now());
        topicRepository.save(topic);
        
        // Send notifications
        notificationService.notifyNewReply(savedReply);
        
        return savedReply;
    }
    
    public void likeTopic(Long topicId, User user) {
        Topic topic = topicRepository.findById(topicId)
            .orElseThrow(() -> new EntityNotFoundException("Topic not found"));
            
        // Check if user already liked this topic
        boolean alreadyLiked = topic.getLikes().stream()
            .anyMatch(like -> like.getUser().getId().equals(user.getId()));
            
        if (!alreadyLiked && !topic.getAuthor().getId().equals(user.getId())) {
            TopicLike like = new TopicLike();
            like.setTopic(topic);
            like.setUser(user);
            like.setCreatedAt(LocalDateTime.now());
            
            topic.getLikes().add(like);
            topicRepository.save(topic);
            
            notificationService.notifyTopicLiked(topic, user);
        }
    }
    
    public Page<Topic> getTopics(TopicCategory category, String search, 
                                String sortBy, Pageable pageable) {
        if (search != null && !search.trim().isEmpty()) {
            return topicRepository.findByTitleContainingIgnoreCase(search, pageable);
        }
        
        if (category != null) {
            return topicRepository.findByCategory(category, pageable);
        }
        
        switch (sortBy) {
            case "popular":
                return new PageImpl<>(topicRepository.findMostLikedTopics(pageable));
            case "active":
                return new PageImpl<>(topicRepository.findMostActiveTopics(pageable));
            default:
                return new PageImpl<>(topicRepository.findRecentTopics(pageable));
        }
    }
}
```

#### **Forum Controller Layer**
```java
// ForumController.java
@RestController
@RequestMapping("/api/forum")
@CrossOrigin(origins = {"http://localhost:5173", "http://localhost:5174"})
public class ForumController {
    
    @Autowired
    private ForumService forumService;
    
    @GetMapping("/topics")
    @PreAuthorize("hasRole('USER') or hasRole('ADMIN')")
    public ResponseEntity<Page<TopicResponse>> getTopics(
            @RequestParam(required = false) TopicCategory category,
            @RequestParam(required = false) String search,
            @RequestParam(defaultValue = "recent") String sortBy,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "20") int size) {
        
        Pageable pageable = PageRequest.of(page, size);
        Page<Topic> topics = forumService.getTopics(category, search, sortBy, pageable);
        
        Page<TopicResponse> response = topics.map(this::convertToTopicResponse);
        return ResponseEntity.ok(response);
    }
    
    @PostMapping("/topics")
    @PreAuthorize("hasRole('USER') or hasRole('ADMIN')")
    public ResponseEntity<TopicResponse> createTopic(
            @Valid @RequestBody CreateTopicRequest request,
            Authentication authentication) {
        
        User user = getUserFromAuthentication(authentication);
        Topic topic = forumService.createTopic(request, user);
        
        return ResponseEntity.status(HttpStatus.CREATED)
            .body(convertToTopicResponse(topic));
    }
    
    @GetMapping("/topics/{id}")
    @PreAuthorize("hasRole('USER') or hasRole('ADMIN')")
    public ResponseEntity<TopicDetailResponse> getTopicDetail(@PathVariable Long id) {
        TopicDetailResponse response = forumService.getTopicDetail(id);
        return ResponseEntity.ok(response);
    }
    
    @PostMapping("/topics/{id}/replies")
    @PreAuthorize("hasRole('USER') or hasRole('ADMIN')")
    public ResponseEntity<ReplyResponse> createReply(
            @PathVariable Long id,
            @Valid @RequestBody CreateReplyRequest request,
            Authentication authentication) {
        
        User user = getUserFromAuthentication(authentication);
        request.setTopicId(id);
        Reply reply = forumService.createReply(request, user);
        
        return ResponseEntity.status(HttpStatus.CREATED)
            .body(convertToReplyResponse(reply));
    }
    
    @PostMapping("/topics/{id}/like")
    @PreAuthorize("hasRole('USER') or hasRole('ADMIN')")
    public ResponseEntity<Void> likeTopic(@PathVariable Long id, 
                                         Authentication authentication) {
        User user = getUserFromAuthentication(authentication);
        forumService.likeTopic(id, user);
        return ResponseEntity.ok().build();
    }
}
```

### 2. Forum System Frontend

#### **Forum Components Structure**
```
frontend/src/components/Forum/
├── ForumHome.jsx              // Main forum page
├── TopicList.jsx              // List of topics with filtering
├── TopicDetail.jsx            // Individual topic view with replies
├── CreateTopic.jsx            // Topic creation form
├── ReplyForm.jsx              // Reply creation/edit form
├── TopicCard.jsx              // Individual topic card component
├── ReplyThread.jsx            // Nested reply display
├── ForumSearch.jsx            // Search and filter component
├── CategoryFilter.jsx         // Category filtering
├── LikeButton.jsx             // Like/unlike functionality
├── ForumNavigation.jsx        // Forum navigation breadcrumbs
└── Forum.css                  // Forum-specific styling
```

#### **Main Forum Components**
```jsx
// ForumHome.jsx
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { apiService } from '../../services/api';
import CleanPageLayout from '../Layout/CleanPageLayout';
import TopicList from './TopicList';
import CategoryFilter from './CategoryFilter';
import ForumSearch from './ForumSearch';
import './Forum.css';

const ForumHome = () => {
  const navigate = useNavigate();
  const [topics, setTopics] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filters, setFilters] = useState({
    category: null,
    search: '',
    sortBy: 'recent'
  });
  const [pagination, setPagination] = useState({
    page: 0,
    size: 20,
    totalPages: 0,
    totalElements: 0
  });

  useEffect(() => {
    fetchTopics();
  }, [filters, pagination.page]);

  const fetchTopics = async () => {
    try {
      setLoading(true);
      const response = await apiService.getForumTopics({
        ...filters,
        page: pagination.page,
        size: pagination.size
      });
      
      setTopics(response.content);
      setPagination(prev => ({
        ...prev,
        totalPages: response.totalPages,
        totalElements: response.totalElements
      }));
    } catch (error) {
      console.error('Error fetching topics:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleFilterChange = (newFilters) => {
    setFilters(prev => ({ ...prev, ...newFilters }));
    setPagination(prev => ({ ...prev, page: 0 }));
  };

  const actions = (
    <button 
      className="professional-btn professional-btn-primary"
      onClick={() => navigate('/forum/create-topic')}
    >
      ✏️ Create Topic
    </button>
  );

  return (
    <CleanPageLayout
      title="💬 Community Forum"
      subtitle="Share financial tips and learn from the community"
      showBackButton
      actions={actions}
    >
      {/* Forum Stats */}
      <div className="professional-grid professional-grid-4">
        <ForumStatCard
          title="Total Topics"
          value={pagination.totalElements}
          icon="💬"
          color="#3b82f6"
        />
        <ForumStatCard
          title="Active Discussions"
          value="24"
          icon="🔥"
          color="#ef4444"
        />
        <ForumStatCard
          title="Community Members"
          value="1,247"
          icon="👥"
          color="#22c55e"
        />
        <ForumStatCard
          title="Tips Shared"
          value="3,891"
          icon="💡"
          color="#f59e0b"
        />
      </div>

      {/* Search and Filters */}
      <div className="professional-card">
        <div className="forum-controls">
          <ForumSearch
            value={filters.search}
            onChange={(search) => handleFilterChange({ search })}
          />
          <CategoryFilter
            value={filters.category}
            onChange={(category) => handleFilterChange({ category })}
          />
          <select
            className="professional-select"
            value={filters.sortBy}
            onChange={(e) => handleFilterChange({ sortBy: e.target.value })}
          >
            <option value="recent">Most Recent</option>
            <option value="popular">Most Popular</option>
            <option value="active">Most Active</option>
          </select>
        </div>
      </div>

      {/* Topics List */}
      <TopicList
        topics={topics}
        loading={loading}
        pagination={pagination}
        onPageChange={(page) => setPagination(prev => ({ ...prev, page }))}
      />
    </CleanPageLayout>
  );
};

// TopicDetail.jsx
const TopicDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  const [topic, setTopic] = useState(null);
  const [replies, setReplies] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showReplyForm, setShowReplyForm] = useState(false);

  useEffect(() => {
    fetchTopicDetail();
  }, [id]);

  const fetchTopicDetail = async () => {
    try {
      setLoading(true);
      const response = await apiService.getForumTopicDetail(id);
      setTopic(response.topic);
      setReplies(response.replies);
    } catch (error) {
      console.error('Error fetching topic detail:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleLikeTopic = async () => {
    try {
      await apiService.likeForumTopic(id);
      // Update local state
      setTopic(prev => ({
        ...prev,
        likeCount: prev.isLikedByUser ? prev.likeCount - 1 : prev.likeCount + 1,
        isLikedByUser: !prev.isLikedByUser
      }));
    } catch (error) {
      console.error('Error liking topic:', error);
    }
  };

  const handleReplySubmit = async (replyData) => {
    try {
      const newReply = await apiService.createForumReply(id, replyData);
      setReplies(prev => [...prev, newReply]);
      setShowReplyForm(false);
    } catch (error) {
      console.error('Error creating reply:', error);
    }
  };

  if (loading) {
    return <div className="loading-spinner">Loading topic...</div>;
  }

  return (
    <CleanPageLayout
      title={topic.title}
      subtitle={`Posted by ${topic.author.username} • ${formatDate(topic.createdAt)}`}
      showBackButton
    >
      {/* Topic Content */}
      <div className="professional-card">
        <div className="topic-header">
          <div className="topic-meta">
            <span className="category-badge" data-category={topic.category}>
              {topic.category}
            </span>
            <div className="topic-stats">
              <span>👁️ {topic.viewCount} views</span>
              <span>💬 {replies.length} replies</span>
              <span>👍 {topic.likeCount} likes</span>
            </div>
          </div>
          <LikeButton
            isLiked={topic.isLikedByUser}
            likeCount={topic.likeCount}
            onClick={handleLikeTopic}
            disabled={topic.author.id === user?.id}
          />
        </div>
        
        <div className="topic-content">
          <ReactMarkdown>{topic.content}</ReactMarkdown>
        </div>
      </div>

      {/* Replies Section */}
      <div className="professional-card">
        <div className="replies-header">
          <h3>💬 Replies ({replies.length})</h3>
          <button
            className="professional-btn professional-btn-primary"
            onClick={() => setShowReplyForm(!showReplyForm)}
          >
            {showReplyForm ? 'Cancel' : 'Reply'}
          </button>
        </div>

        {showReplyForm && (
          <ReplyForm
            onSubmit={handleReplySubmit}
            onCancel={() => setShowReplyForm(false)}
          />
        )}

        <ReplyThread
          replies={replies}
          onReplyUpdate={fetchTopicDetail}
        />
      </div>
    </CleanPageLayout>
  );
};
```

### 3. Comprehensive Testing Framework

#### **Frontend Testing Structure**
```
frontend/src/
├── __tests__/
│   ├── components/
│   │   ├── Auth/
│   │   │   ├── SignIn.test.jsx
│   │   │   ├── SignUp.test.jsx
│   │   │   └── ForgotPassword.test.jsx
│   │   ├── Dashboard/
│   │   │   └── Dashboard.test.jsx
│   │   ├── Transactions/
│   │   │   ├── Transactions.test.jsx
│   │   │   └── TransactionSummary.test.jsx
│   │   ├── Forum/
│   │   │   ├── ForumHome.test.jsx
│   │   │   ├── TopicDetail.test.jsx
│   │   │   └── CreateTopic.test.jsx
│   │   └── Common/
│   │       ├── ErrorBoundary.test.jsx
│   │       └── ProfessionalTooltip.test.jsx
│   ├── utils/
│   │   ├── currencyFormatter.test.js
│   │   ├── financialHealthCalculator.test.js
│   │   └── errorHandler.test.js
│   ├── services/
│   │   └── api.test.js
│   └── integration/
│       ├── authFlow.test.jsx
│       ├── transactionFlow.test.jsx
│       └── forumFlow.test.jsx
├── __mocks__/
│   ├── api.js
│   └── localStorage.js
└── setupTests.js
```

#### **Sample Test Implementation**
```jsx
// __tests__/components/Forum/ForumHome.test.jsx
import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import { AuthProvider } from '../../../contexts/AuthContext';
import ForumHome from '../../../components/Forum/ForumHome';
import * as apiService from '../../../services/api';

// Mock the API service
jest.mock('../../../services/api');

const mockTopicsResponse = {
  content: [
    {
      id: 1,
      title: 'Best budgeting apps for beginners',
      category: 'BUDGETING',
      author: { username: 'testuser' },
      createdAt: '2025-01-01T10:00:00',
      likeCount: 5,
      replyCount: 3
    }
  ],
  totalPages: 1,
  totalElements: 1
};

const renderWithProviders = (component) => {
  return render(
    <BrowserRouter>
      <AuthProvider>
        {component}
      </AuthProvider>
    </BrowserRouter>
  );
};

describe('ForumHome', () => {
  beforeEach(() => {
    apiService.getForumTopics.mockResolvedValue(mockTopicsResponse);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  test('renders forum home page with topics', async () => {
    renderWithProviders(<ForumHome />);
    
    expect(screen.getByText('Community Forum')).toBeInTheDocument();
    
    await waitFor(() => {
      expect(screen.getByText('Best budgeting apps for beginners')).toBeInTheDocument();
    });
  });

  test('filters topics by category', async () => {
    renderWithProviders(<ForumHome />);
    
    await waitFor(() => {
      expect(screen.getByText('Best budgeting apps for beginners')).toBeInTheDocument();
    });

    const categoryFilter = screen.getByDisplayValue('All Categories');
    fireEvent.change(categoryFilter, { target: { value: 'BUDGETING' } });

    await waitFor(() => {
      expect(apiService.getForumTopics).toHaveBeenCalledWith(
        expect.objectContaining({ category: 'BUDGETING' })
      );
    });
  });

  test('searches topics by title', async () => {
    renderWithProviders(<ForumHome />);
    
    const searchInput = screen.getByPlaceholderText('Search topics...');
    fireEvent.change(searchInput, { target: { value: 'budgeting' } });
    fireEvent.submit(searchInput.closest('form'));

    await waitFor(() => {
      expect(apiService.getForumTopics).toHaveBeenCalledWith(
        expect.objectContaining({ search: 'budgeting' })
      );
    });
  });

  test('navigates to create topic page', () => {
    const mockNavigate = jest.fn();
    jest.mock('react-router-dom', () => ({
      ...jest.requireActual('react-router-dom'),
      useNavigate: () => mockNavigate
    }));

    renderWithProviders(<ForumHome />);
    
    const createButton = screen.getByText('Create Topic');
    fireEvent.click(createButton);

    expect(mockNavigate).toHaveBeenCalledWith('/forum/create-topic');
  });
});

// __tests__/utils/financialHealthCalculator.test.js
import { calculateFinancialHealthScore, getHealthScoreStatus } from '../../utils/financialHealthCalculator';

describe('Financial Health Calculator', () => {
  const mockUser = {
    monthlyIncome: 50000,
    currentSavings: 100000,
    targetExpenses: 30000,
    monthlyDebt: 5000
  };

  const mockTransactions = [
    { type: 'INCOME', amount: 50000, category: 'Salary' },
    { type: 'EXPENSE', amount: -25000, category: 'Food' },
    { type: 'EXPENSE', amount: -5000, category: 'Transport' }
  ];

  test('calculates health score correctly', () => {
    const result = calculateFinancialHealthScore(mockUser, mockTransactions);
    
    expect(result).toHaveProperty('score');
    expect(result).toHaveProperty('factors');
    expect(result).toHaveProperty('recommendations');
    expect(result.score).toBeGreaterThanOrEqual(0);
    expect(result.score).toBeLessThanOrEqual(100);
  });

  test('returns correct health status for different scores', () => {
    expect(getHealthScoreStatus(85)).toEqual(
      expect.objectContaining({ status: 'Excellent', color: '#10b981' })
    );
    expect(getHealthScoreStatus(65)).toEqual(
      expect.objectContaining({ status: 'Good', color: '#3b82f6' })
    );
    expect(getHealthScoreStatus(45)).toEqual(
      expect.objectContaining({ status: 'Fair', color: '#f59e0b' })
    );
    expect(getHealthScoreStatus(25)).toEqual(
      expect.objectContaining({ status: 'Needs Work', color: '#ef4444' })
    );
  });

  test('handles edge cases gracefully', () => {
    const userWithNoIncome = { ...mockUser, monthlyIncome: 0 };
    const result = calculateFinancialHealthScore(userWithNoIncome, []);
    
    expect(result.score).toBeDefined();
    expect(result.factors).toHaveLength(6);
  });
});
```

### 4. Advanced Export System

#### **Enhanced Export Service**
```java
// Enhanced ExportService.java
@Service
public class EnhancedExportService extends ExportService {
    
    @Autowired
    private EmailService emailService;
    
    @Autowired
    private TemplateService templateService;
    
    public byte[] exportToExcel(String username, ExportRequest request) throws IOException {
        User user = getUserByUsername(username);
        List<Transaction> transactions = getTransactionsForExport(user, request);
        
        try (Workbook workbook = new XSSFWorkbook()) {
            // Create summary sheet
            Sheet summarySheet = workbook.createSheet("Financial Summary");
            createSummarySheet(summarySheet, user, transactions);
            
            // Create transactions sheet
            Sheet transactionsSheet = workbook.createSheet("Transactions");
            createTransactionsSheet(transactionsSheet, transactions);
            
            // Create charts sheet
            Sheet chartsSheet = workbook.createSheet("Charts");
            createChartsSheet(chartsSheet, workbook, transactions);
            
            // Apply styling
            applyExcelStyling(workbook);
            
            ByteArrayOutputStream outputStream = new ByteArrayOutputStream();
            workbook.write(outputStream);
            return outputStream.toByteArray();
        }
    }
    
    public void scheduleReport(String username, ScheduledReportRequest request) {
        ScheduledReport report = new ScheduledReport();
        report.setUsername(username);
        report.setReportType(request.getReportType());
        report.setSchedule(request.getSchedule());
        report.setEmailDelivery(request.isEmailDelivery());
        report.setActive(true);
        
        scheduledReportRepository.save(report);
        
        // Schedule with task scheduler
        taskScheduler.scheduleAtFixedRate(
            () -> generateAndDeliverReport(report),
            request.getSchedule().getNextExecutionTime()
        );
    }
    
    public void emailReport(String username, EmailReportRequest request) throws Exception {
        byte[] reportData = generateReport(username, request);
        
        EmailTemplate template = templateService.getEmailTemplate("REPORT_DELIVERY");
        String emailContent = template.render(Map.of(
            "username", username,
            "reportType", request.getReportType(),
            "generatedDate", LocalDate.now()
        ));
        
        emailService.sendEmailWithAttachment(
            request.getRecipientEmail(),
            "Your Financial Report - " + LocalDate.now(),
            emailContent,
            "financial-report." + request.getFormat().toLowerCase(),
            reportData
        );
    }
}
```

## Data Models

### Forum Database Schema
```sql
-- Forum Topics Table
CREATE TABLE forum_topics (
    id BIGINT PRIMARY KEY AUTO_INCREMENT,
    title VARCHAR(255) NOT NULL,
    content TEXT NOT NULL,
    category VARCHAR(50) NOT NULL,
    author_id BIGINT NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    is_pinned BOOLEAN DEFAULT FALSE,
    is_locked BOOLEAN DEFAULT FALSE,
    view_count BIGINT DEFAULT 0,
    FOREIGN KEY (author_id) REFERENCES users(id) ON DELETE CASCADE,
    INDEX idx_category (category),
    INDEX idx_created_at (created_at),
    INDEX idx_author (author_id)
);

-- Forum Replies Table
CREATE TABLE forum_replies (
    id BIGINT PRIMARY KEY AUTO_INCREMENT,
    content TEXT NOT NULL,
    topic_id BIGINT NOT NULL,
    author_id BIGINT NOT NULL,
    parent_reply_id BIGINT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (topic_id) REFERENCES forum_topics(id) ON DELETE CASCADE,
    FOREIGN KEY (author_id) REFERENCES users(id) ON DELETE CASCADE,
    FOREIGN KEY (parent_reply_id) REFERENCES forum_replies(id) ON DELETE CASCADE,
    INDEX idx_topic (topic_id),
    INDEX idx_author (author_id),
    INDEX idx_parent (parent_reply_id)
);

-- Topic Likes Table
CREATE TABLE forum_topic_likes (
    id BIGINT PRIMARY KEY AUTO_INCREMENT,
    topic_id BIGINT NOT NULL,
    user_id BIGINT NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (topic_id) REFERENCES forum_topics(id) ON DELETE CASCADE,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
    UNIQUE KEY unique_topic_like (topic_id, user_id)
);

-- Reply Likes Table
CREATE TABLE forum_reply_likes (
    id BIGINT PRIMARY KEY AUTO_INCREMENT,
    reply_id BIGINT NOT NULL,
    user_id BIGINT NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (reply_id) REFERENCES forum_replies(id) ON DELETE CASCADE,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
    UNIQUE KEY unique_reply_like (reply_id, user_id)
);

-- Scheduled Reports Table
CREATE TABLE scheduled_reports (
    id BIGINT PRIMARY KEY AUTO_INCREMENT,
    username VARCHAR(255) NOT NULL,
    report_type VARCHAR(50) NOT NULL,
    schedule_expression VARCHAR(100) NOT NULL,
    email_delivery BOOLEAN DEFAULT FALSE,
    recipient_email VARCHAR(255),
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    last_executed TIMESTAMP NULL,
    next_execution TIMESTAMP NULL
);
```

## Error Handling

### Forum Error Handling
- **Topic Not Found**: Return 404 with user-friendly message
- **Unauthorized Access**: Return 403 for locked topics or insufficient permissions
- **Validation Errors**: Return 400 with detailed field validation messages
- **Rate Limiting**: Implement rate limiting for topic/reply creation
- **Content Moderation**: Basic spam detection and content filtering

### Testing Error Scenarios
- **Network Failures**: Mock API failures and test error boundaries
- **Invalid Data**: Test component behavior with malformed data
- **Authentication Errors**: Test unauthorized access scenarios
- **Performance Issues**: Test with large datasets and slow responses

## Testing Strategy

### Unit Testing Approach
- **Component Testing**: Test each React component in isolation
- **Utility Testing**: Test all helper functions and utilities
- **Service Testing**: Test API service methods and error handling
- **Hook Testing**: Test custom React hooks behavior

### Integration Testing
- **API Integration**: Test complete request/response cycles
- **Component Integration**: Test component interactions and data flow
- **Authentication Flow**: Test login/logout and protected routes
- **Forum Workflow**: Test complete forum interaction flows

### End-to-End Testing
- **Critical User Journeys**: Test complete user workflows
- **Cross-browser Testing**: Ensure compatibility across browsers
- **Mobile Testing**: Test responsive behavior on mobile devices
- **Performance Testing**: Test application performance under load

## Implementation Phases

### Phase 1: Forum Backend (Week 1)
1. Create forum entity models and repositories
2. Implement forum service layer with business logic
3. Build forum REST API controllers
4. Add database migrations and seed data
5. Implement basic authentication and authorization

### Phase 2: Forum Frontend (Week 2)
1. Create forum component structure
2. Implement topic listing and detail views
3. Build topic creation and reply functionality
4. Add like/unlike features and real-time updates
5. Implement search and filtering capabilities

### Phase 3: Advanced Export Features (Week 3)
1. Implement Excel export with Apache POI
2. Build email service integration
3. Create scheduled report functionality
4. Add custom report templates
5. Implement batch export operations

### Phase 4: Comprehensive Testing (Week 4)
1. Write unit tests for all components and utilities
2. Implement integration tests for API endpoints
3. Create end-to-end tests for critical workflows
4. Set up automated testing pipeline
5. Achieve 80%+ test coverage

### Phase 5: Polish and Optimization (Week 5)
1. Performance optimization and caching
2. Mobile responsiveness improvements
3. Accessibility compliance testing
4. Security audit and improvements
5. Documentation and deployment preparation

## Performance Considerations

### Forum Performance
- **Pagination**: Implement efficient pagination for large topic lists
- **Caching**: Cache frequently accessed topics and user data
- **Database Optimization**: Add proper indexes and query optimization
- **Real-time Updates**: Use WebSocket for live notifications

### Testing Performance
- **Parallel Execution**: Run tests in parallel for faster feedback
- **Test Isolation**: Ensure tests don't interfere with each other
- **Mock Optimization**: Use efficient mocking strategies
- **CI/CD Integration**: Optimize test execution in build pipeline

## Security Considerations

### Forum Security
- **Input Validation**: Sanitize all user inputs to prevent XSS
- **Authentication**: Ensure proper user authentication for all actions
- **Authorization**: Implement role-based access control
- **Rate Limiting**: Prevent spam and abuse through rate limiting
- **Content Moderation**: Basic content filtering and reporting system

### Testing Security
- **Authentication Testing**: Test security boundaries and access controls
- **Input Validation Testing**: Test with malicious inputs and edge cases
- **Authorization Testing**: Verify role-based access restrictions
- **Data Privacy**: Ensure test data doesn't contain sensitive information