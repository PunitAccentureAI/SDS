import React from 'react';
import { Container, Row, Col, Card, Button } from 'react-bootstrap';
import { Link } from 'react-router-dom';

const features = [
  {
    title: 'Fast Performance',
    text: 'Built with modern React for blazing fast rendering and smooth user experience.',
    icon: '⚡',
  },
  {
    title: 'Responsive Design',
    text: 'Fully responsive layout powered by Bootstrap 5 that looks great on any device.',
    icon: '📱',
  },
  {
    title: 'Easy to Customize',
    text: 'Modular component architecture makes it simple to adapt to your needs.',
    icon: '🎨',
  },
];

export default function Home() {
  return (
    <>
      <div className="bg-primary text-white py-5">
        <Container className="py-5 text-center">
          <h1 className="display-3 fw-bold mb-3">Welcome to SDS Component</h1>
          <p className="lead mb-4 mx-auto" style={{ maxWidth: 600 }}>
            A modern React application built with Bootstrap 5 for beautiful,
            responsive, and production-ready user interfaces.
          </p>
          <div className="d-flex gap-3 justify-content-center">
            <Button as={Link} to="/about" variant="light" size="lg">
              Learn More
            </Button>
            <Button as={Link} to="/contact" variant="outline-light" size="lg">
              Get in Touch
            </Button>
          </div>
        </Container>
      </div>

      <Container className="py-5">
        <Row className="g-4">
          {features.map((feature, idx) => (
            <Col md={4} key={idx}>
              <Card className="h-100 border-0 shadow-sm text-center p-3">
                <Card.Body>
                  <div className="display-4 mb-3">{feature.icon}</div>
                  <Card.Title className="fw-semibold fs-5">
                    {feature.title}
                  </Card.Title>
                  <Card.Text className="text-muted">{feature.text}</Card.Text>
                </Card.Body>
              </Card>
            </Col>
          ))}
        </Row>
      </Container>

      <div className="bg-light py-5">
        <Container className="text-center">
          <h2 className="fw-bold mb-3">Ready to Get Started?</h2>
          <p className="text-muted mb-4">
            Start building your next project with SDS Component today.
          </p>
          <Button as={Link} to="/contact" variant="primary" size="lg">
            Contact Us
          </Button>
        </Container>
      </div>
    </>
  );
}
