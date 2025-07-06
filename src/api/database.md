# Database Schema for Preach It Enterprise

## Contact Messages Table (pie_contact_messages)

```sql
CREATE TABLE pie_contact_messages (
  id INT AUTO_INCREMENT PRIMARY KEY,
  name VARCHAR(255) NOT NULL,
  email VARCHAR(255) NOT NULL,
  phone VARCHAR(20),
  message TEXT NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  status ENUM('unread', 'read', 'replied') DEFAULT 'unread'
);
```

## Tracking Information Table (pie_tracking)

```sql
CREATE TABLE pie_tracking (
  id INT AUTO_INCREMENT PRIMARY KEY,
  tracking_number VARCHAR(50) UNIQUE NOT NULL,
  status VARCHAR(50) NOT NULL,
  current_location VARCHAR(255),
  estimated_delivery DATE,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);
```

## Tracking Events Table (pie_tracking_events)

```sql
CREATE TABLE pie_tracking_events (
  id INT AUTO_INCREMENT PRIMARY KEY,
  tracking_id INT NOT NULL,
  event_date DATE NOT NULL,
  event_time TIME NOT NULL,
  location VARCHAR(255) NOT NULL,
  status VARCHAR(255) NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (tracking_id) REFERENCES pie_tracking(id)
);
```

## PHP Backend API Endpoints

### 1. Contact Form Submission
```php
<?php
// contact.php
header('Content-Type: application/json');
header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Methods: POST');
header('Access-Control-Allow-Headers: Content-Type');

if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    $data = json_decode(file_get_contents('php://input'), true);
    
    $name = $data['name'];
    $email = $data['email'];
    $phone = $data['phone'];
    $message = $data['message'];
    
    // Database connection
    $conn = new mysqli('localhost', 'username', 'password', 'pie_db');
    
    if ($conn->connect_error) {
        die(json_encode(['error' => 'Connection failed']));
    }
    
    $stmt = $conn->prepare("INSERT INTO pie_contact_messages (name, email, phone, message) VALUES (?, ?, ?, ?)");
    $stmt->bind_param("ssss", $name, $email, $phone, $message);
    
    if ($stmt->execute()) {
        echo json_encode(['success' => true]);
    } else {
        echo json_encode(['error' => 'Failed to save message']);
    }
    
    $stmt->close();
    $conn->close();
}
?>
```

### 2. Tracking API
```php
<?php
// tracking.php
header('Content-Type: application/json');
header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Methods: GET');

if ($_SERVER['REQUEST_METHOD'] === 'GET') {
    $tracking_number = $_GET['tracking_number'];
    
    // Database connection
    $conn = new mysqli('localhost', 'username', 'password', 'pie_db');
    
    if ($conn->connect_error) {
        die(json_encode(['error' => 'Connection failed']));
    }
    
    $stmt = $conn->prepare("SELECT * FROM pie_tracking WHERE tracking_number = ?");
    $stmt->bind_param("s", $tracking_number);
    $stmt->execute();
    
    $result = $stmt->get_result();
    $tracking = $result->fetch_assoc();
    
    if ($tracking) {
        // Get tracking events
        $events_stmt = $conn->prepare("SELECT * FROM pie_tracking_events WHERE tracking_id = ? ORDER BY event_date DESC, event_time DESC");
        $events_stmt->bind_param("i", $tracking['id']);
        $events_stmt->execute();
        
        $events_result = $events_stmt->get_result();
        $events = [];
        
        while ($row = $events_result->fetch_assoc()) {
            $events[] = $row;
        }
        
        $tracking['events'] = $events;
        echo json_encode($tracking);
    } else {
        echo json_encode(['error' => 'Tracking number not found']);
    }
    
    $stmt->close();
    $conn->close();
}
?>
```

## Frontend Integration

To connect the React frontend to the PHP backend, update the API calls in the components:

### Contact Form API Integration
```javascript
// In ContactForm.tsx, replace the simulation with:
const handleSubmit = async (e: React.FormEvent) => {
  e.preventDefault();
  setIsSubmitting(true);

  try {
    const response = await fetch('http://your-domain.com/api/contact.php', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(formData),
    });

    const result = await response.json();
    
    if (result.success) {
      setSubmitted(true);
      setFormData({ name: '', email: '', phone: '', message: '' });
    } else {
      console.error('Error:', result.error);
    }
  } catch (error) {
    console.error('Network error:', error);
  } finally {
    setIsSubmitting(false);
  }
};
```

### Tracking API Integration
```javascript
// In TrackingForm.tsx, replace the simulation with:
const handleTrack = async (e: React.FormEvent) => {
  e.preventDefault();
  if (!trackingNumber.trim()) return;

  setIsLoading(true);
  
  try {
    const response = await fetch(`http://your-domain.com/api/tracking.php?tracking_number=${trackingNumber}`);
    const result = await response.json();
    
    if (result.error) {
      console.error('Error:', result.error);
    } else {
      setTrackingResult(result);
    }
  } catch (error) {
    console.error('Network error:', error);
  } finally {
    setIsLoading(false);
  }
};
```

## Installation Instructions

1. Import the SQL schema into your phpMyAdmin database
2. Update the database connection credentials in the PHP files
3. Upload the PHP files to your web server
4. Update the API endpoints in the React components
5. Build and deploy the React application

Note: Make sure to configure CORS properly for cross-origin requests between your React frontend and PHP backend.