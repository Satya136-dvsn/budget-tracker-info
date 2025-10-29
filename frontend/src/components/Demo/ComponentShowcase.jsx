import React, { useState } from 'react';
import {
  ProfessionalCard,
  ProfessionalButton,
  ProfessionalInput,
  ProfessionalSelect,
  ProfessionalTextarea,
  ProfessionalBadge,
  ProfessionalProgress,
  ProfessionalAlert,
  ProfessionalModal,
  ProfessionalSkeleton,
  ProfessionalLoading,
  ProfessionalTable,
  ProfessionalForm,
  ProfessionalFormGroup,
  ProfessionalFormLabel,
  ProfessionalFormError
} from '../UI';

const ComponentShowcase = () => {
  const [modalOpen, setModalOpen] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    category: '',
    message: ''
  });

  const selectOptions = [
    { value: 'general', label: 'General Inquiry' },
    { value: 'support', label: 'Support Request' },
    { value: 'feedback', label: 'Feedback' }
  ];

  const tableColumns = [
    { key: 'name', title: 'Name' },
    { key: 'email', title: 'Email' },
    { key: 'status', title: 'Status', render: (value) => (
      <ProfessionalBadge variant={value === 'active' ? 'success' : 'warning'}>
        {value}
      </ProfessionalBadge>
    )}
  ];

  const tableData = [
    { id: 1, name: 'John Doe', email: 'john@example.com', status: 'active' },
    { id: 2, name: 'Jane Smith', email: 'jane@example.com', status: 'inactive' },
    { id: 3, name: 'Bob Johnson', email: 'bob@example.com', status: 'active' }
  ];

  const handleInputChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  return (
    <div style={{ padding: '2rem', maxWidth: '1200px', margin: '0 auto' }}>
      <h1 style={{ color: 'var(--text-primary)', marginBottom: '2rem' }}>
        Professional Component Library Showcase
      </h1>

      {/* Cards Section */}
      <section style={{ marginBottom: '3rem' }}>
        <h2 style={{ color: 'var(--text-secondary)', marginBottom: '1rem' }}>Cards</h2>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '1rem' }}>
          <ProfessionalCard>
            <h3>Default Card</h3>
            <p>This is a default professional card with hover effects.</p>
          </ProfessionalCard>
          
          <ProfessionalCard variant="elevated">
            <h3>Elevated Card</h3>
            <p>This card has an elevated appearance with enhanced styling.</p>
          </ProfessionalCard>
          
          <ProfessionalCard variant="glass">
            <h3>Glass Card</h3>
            <p>This card features glassmorphism effects with backdrop blur.</p>
          </ProfessionalCard>
        </div>
      </section>

      {/* Buttons Section */}
      <section style={{ marginBottom: '3rem' }}>
        <h2 style={{ color: 'var(--text-secondary)', marginBottom: '1rem' }}>Buttons</h2>
        <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap', alignItems: 'center' }}>
          <ProfessionalButton variant="primary">Primary Button</ProfessionalButton>
          <ProfessionalButton variant="secondary">Secondary Button</ProfessionalButton>
          <ProfessionalButton variant="outline">Outline Button</ProfessionalButton>
          <ProfessionalButton variant="ghost">Ghost Button</ProfessionalButton>
          <ProfessionalButton size="small">Small Button</ProfessionalButton>
          <ProfessionalButton size="large">Large Button</ProfessionalButton>
          <ProfessionalButton loading>Loading...</ProfessionalButton>
          <ProfessionalButton disabled>Disabled</ProfessionalButton>
        </div>
      </section>

      {/* Form Components Section */}
      <section style={{ marginBottom: '3rem' }}>
        <h2 style={{ color: 'var(--text-secondary)', marginBottom: '1rem' }}>Form Components</h2>
        <ProfessionalCard>
          <ProfessionalForm>
            <ProfessionalFormGroup>
              <ProfessionalFormLabel htmlFor="name" required>Name</ProfessionalFormLabel>
              <ProfessionalInput
                id="name"
                name="name"
                placeholder="Enter your name"
                value={formData.name}
                onChange={handleInputChange}
              />
            </ProfessionalFormGroup>

            <ProfessionalFormGroup>
              <ProfessionalFormLabel htmlFor="email">Email</ProfessionalFormLabel>
              <ProfessionalInput
                id="email"
                name="email"
                type="email"
                placeholder="Enter your email"
                value={formData.email}
                onChange={handleInputChange}
              />
            </ProfessionalFormGroup>

            <ProfessionalFormGroup>
              <ProfessionalFormLabel htmlFor="category">Category</ProfessionalFormLabel>
              <ProfessionalSelect
                id="category"
                name="category"
                options={selectOptions}
                value={formData.category}
                onChange={handleInputChange}
                placeholder="Select a category"
              />
            </ProfessionalFormGroup>

            <ProfessionalFormGroup>
              <ProfessionalFormLabel htmlFor="message">Message</ProfessionalFormLabel>
              <ProfessionalTextarea
                id="message"
                name="message"
                placeholder="Enter your message"
                value={formData.message}
                onChange={handleInputChange}
                rows={4}
              />
            </ProfessionalFormGroup>

            <div style={{ display: 'flex', gap: '1rem' }}>
              <ProfessionalButton variant="primary" type="submit">Submit</ProfessionalButton>
              <ProfessionalButton variant="outline" type="button">Cancel</ProfessionalButton>
            </div>
          </ProfessionalForm>
        </ProfessionalCard>
      </section>

      {/* Badges Section */}
      <section style={{ marginBottom: '3rem' }}>
        <h2 style={{ color: 'var(--text-secondary)', marginBottom: '1rem' }}>Badges</h2>
        <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap', alignItems: 'center' }}>
          <ProfessionalBadge>Default</ProfessionalBadge>
          <ProfessionalBadge variant="primary">Primary</ProfessionalBadge>
          <ProfessionalBadge variant="success">Success</ProfessionalBadge>
          <ProfessionalBadge variant="warning">Warning</ProfessionalBadge>
          <ProfessionalBadge variant="error">Error</ProfessionalBadge>
        </div>
      </section>

      {/* Progress Section */}
      <section style={{ marginBottom: '3rem' }}>
        <h2 style={{ color: 'var(--text-secondary)', marginBottom: '1rem' }}>Progress Bars</h2>
        <ProfessionalCard>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            <div>
              <p style={{ marginBottom: '0.5rem', color: 'var(--text-secondary)' }}>Default Progress (75%)</p>
              <ProfessionalProgress value={75} showLabel />
            </div>
            <div>
              <p style={{ marginBottom: '0.5rem', color: 'var(--text-secondary)' }}>Success Progress (90%)</p>
              <ProfessionalProgress value={90} variant="success" showLabel />
            </div>
            <div>
              <p style={{ marginBottom: '0.5rem', color: 'var(--text-secondary)' }}>Warning Progress (45%)</p>
              <ProfessionalProgress value={45} variant="warning" showLabel />
            </div>
          </div>
        </ProfessionalCard>
      </section>

      {/* Alerts Section */}
      <section style={{ marginBottom: '3rem' }}>
        <h2 style={{ color: 'var(--text-secondary)', marginBottom: '1rem' }}>Alerts</h2>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          <ProfessionalAlert 
            variant="info" 
            title="Information" 
            message="This is an informational alert message."
          />
          <ProfessionalAlert 
            variant="success" 
            title="Success" 
            message="Your action was completed successfully."
          />
          <ProfessionalAlert 
            variant="warning" 
            title="Warning" 
            message="Please review your input before proceeding."
          />
          <ProfessionalAlert 
            variant="error" 
            title="Error" 
            message="An error occurred while processing your request."
          />
        </div>
      </section>

      {/* Table Section */}
      <section style={{ marginBottom: '3rem' }}>
        <h2 style={{ color: 'var(--text-secondary)', marginBottom: '1rem' }}>Table</h2>
        <ProfessionalTable 
          columns={tableColumns}
          data={tableData}
          onRowClick={(row) => console.log('Row clicked:', row)}
        />
      </section>

      {/* Loading States Section */}
      <section style={{ marginBottom: '3rem' }}>
        <h2 style={{ color: 'var(--text-secondary)', marginBottom: '1rem' }}>Loading States</h2>
        <ProfessionalCard>
          <div style={{ display: 'flex', gap: '2rem', alignItems: 'center', flexWrap: 'wrap' }}>
            <ProfessionalLoading size="small" text="Small Loading" />
            <ProfessionalLoading size="default" text="Default Loading" />
            <ProfessionalLoading size="large" text="Large Loading" />
            <ProfessionalLoading showText={false} />
          </div>
        </ProfessionalCard>
      </section>

      {/* Skeleton Section */}
      <section style={{ marginBottom: '3rem' }}>
        <h2 style={{ color: 'var(--text-secondary)', marginBottom: '1rem' }}>Skeleton Loading</h2>
        <ProfessionalCard>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            <ProfessionalSkeleton variant="title" />
            <ProfessionalSkeleton variant="text" />
            <ProfessionalSkeleton variant="text" width="80%" />
            <div style={{ display: 'flex', gap: '1rem', alignItems: 'center' }}>
              <ProfessionalSkeleton variant="avatar" />
              <div style={{ flex: 1 }}>
                <ProfessionalSkeleton variant="text" width="60%" />
                <ProfessionalSkeleton variant="text" width="40%" />
              </div>
            </div>
          </div>
        </ProfessionalCard>
      </section>

      {/* Modal Section */}
      <section style={{ marginBottom: '3rem' }}>
        <h2 style={{ color: 'var(--text-secondary)', marginBottom: '1rem' }}>Modal</h2>
        <ProfessionalButton 
          variant="primary" 
          onClick={() => setModalOpen(true)}
        >
          Open Modal
        </ProfessionalButton>

        <ProfessionalModal
          isOpen={modalOpen}
          onClose={() => setModalOpen(false)}
          title="Professional Modal"
          footer={
            <>
              <ProfessionalButton variant="outline" onClick={() => setModalOpen(false)}>
                Cancel
              </ProfessionalButton>
              <ProfessionalButton variant="primary" onClick={() => setModalOpen(false)}>
                Confirm
              </ProfessionalButton>
            </>
          }
        >
          <p>This is a professional modal dialog with a backdrop blur effect and smooth animations.</p>
          <p>It includes proper focus management, keyboard navigation, and accessibility features.</p>
        </ProfessionalModal>
      </section>
    </div>
  );
};

export default ComponentShowcase;