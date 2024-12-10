import React from 'react';

const topics = [
  'Engineering', 'Mathematics', 'Biology', 
  'Computer Science', 'Climate Change', 'Medicine', 
  'Physics', 'Social Science', 'Astrophysics', 'Chemistry'
];

function TopicSection() {
  return (
    <div style={styles.container}>
      <div style={styles.textContainer}>
        <h1 style={styles.heading}>Connect with your scientific community</h1>
        <p style={styles.subheading}>
          Share your research, collaborate with your peers, and get the support you need to advance your career.
        </p>
      </div>
      <div style={styles.topicContainer}>
        <h4 style={styles.topicHeading}>Visit Topic Pages</h4>
        <div style={styles.topicList}>
          {topics.map((topic, index) => (
            <div key={index} style={styles.topicButton}>
              {topic}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

const styles = {
  container: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'flex-start',
    padding: '20px',
    fontFamily: 'Arial, sans-serif',
    color: '#1C1C1C'
  },
  textContainer: {
    marginBottom: '20px'
  },
  heading: {
    fontSize: '2em',
    fontWeight: 'bold',
    marginBottom: '10px'
  },
  subheading: {
    fontSize: '1em',
    color: '#666666'
  },
  topicContainer: {
    marginTop: '20px'
  },
  topicHeading: {
    fontSize: '0.9em',
    color: '#888888',
    fontWeight: '600',
    marginBottom: '10px'
  },
  topicList: {
    display: 'flex',
    flexWrap: 'wrap',
    gap: '10px'
  },
  topicButton: {
    padding: '8px 12px',
    border: '1px solid #4CAF50',
    borderRadius: '20px',
    fontSize: '0.9em',
    color: '#4CAF50',
    cursor: 'pointer',
    textAlign: 'center'
  }
};

export default TopicSection;
