-- Add transactions table
CREATE TABLE IF NOT EXISTS transactions (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    user_id BIGINT NOT NULL,
    type ENUM('INCOME', 'EXPENSE') NOT NULL,
    category VARCHAR(100) NOT NULL,
    amount DECIMAL(15, 2) NOT NULL,
    description TEXT,
    transaction_date DATETIME NOT NULL,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
    INDEX idx_user_id (user_id),
    INDEX idx_type (type),
    INDEX idx_category (category),
    INDEX idx_transaction_date (transaction_date),
    INDEX idx_user_type (user_id, type),
    INDEX idx_user_category (user_id, category),
    INDEX idx_user_date (user_id, transaction_date)
);

-- Add categories table
CREATE TABLE IF NOT EXISTS categories (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(100) NOT NULL UNIQUE,
    description TEXT,
    type ENUM('INCOME', 'EXPENSE', 'BOTH') NOT NULL DEFAULT 'BOTH',
    icon VARCHAR(50),
    color VARCHAR(7),
    is_active BOOLEAN DEFAULT TRUE,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    INDEX idx_name (name),
    INDEX idx_type (type),
    INDEX idx_active (is_active),
    INDEX idx_type_active (type, is_active)
);

-- Insert default income categories
INSERT IGNORE INTO categories (name, description, type, icon, color) VALUES
('Salary', 'Regular monthly salary', 'INCOME', '💼', '#4CAF50'),
('Freelance', 'Freelance work income', 'INCOME', '💻', '#2196F3'),
('Investment', 'Investment returns', 'INCOME', '📈', '#FF9800'),
('Bonus', 'Work bonus', 'INCOME', '🎁', '#9C27B0'),
('Side Business', 'Side business income', 'INCOME', '🏪', '#607D8B'),
('Rental', 'Rental income', 'INCOME', '🏠', '#795548'),
('Gift', 'Money received as gift', 'INCOME', '💝', '#E91E63'),
('Other Income', 'Other sources of income', 'INCOME', '💰', '#00BCD4');

-- Insert default expense categories
INSERT IGNORE INTO categories (name, description, type, icon, color) VALUES
('Food & Dining', 'Restaurants, groceries, food delivery', 'EXPENSE', '🍽️', '#FF5722'),
('Transportation', 'Gas, public transport, car maintenance', 'EXPENSE', '🚗', '#3F51B5'),
('Shopping', 'Clothes, electronics, miscellaneous purchases', 'EXPENSE', '🛍️', '#E91E63'),
('Entertainment', 'Movies, concerts, hobbies', 'EXPENSE', '🎬', '#9C27B0'),
('Bills & Utilities', 'Electricity, water, internet, phone', 'EXPENSE', '💡', '#FF9800'),
('Healthcare', 'Medical expenses, pharmacy, insurance', 'EXPENSE', '🏥', '#F44336'),
('Education', 'Books, courses, training', 'EXPENSE', '📚', '#2196F3'),
('Travel', 'Vacation, business trips', 'EXPENSE', '✈️', '#00BCD4'),
('Housing', 'Rent, mortgage, home maintenance', 'EXPENSE', '🏠', '#795548'),
('Insurance', 'Life, health, car insurance', 'EXPENSE', '🛡️', '#607D8B'),
('Fitness', 'Gym membership, sports equipment', 'EXPENSE', '💪', '#4CAF50'),
('Personal Care', 'Haircut, cosmetics, spa', 'EXPENSE', '💄', '#E91E63'),
('Gifts & Donations', 'Gifts for others, charitable donations', 'EXPENSE', '🎁', '#9C27B0'),
('Other Expenses', 'Miscellaneous expenses', 'EXPENSE', '💸', '#757575');