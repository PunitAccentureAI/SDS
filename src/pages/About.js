import React from 'react';
import { Container, Row, Col, Card } from 'react-bootstrap';

const team = [
  { name: 'Alice Johnson', role: 'Frontend Developer' },
  { name: 'Bob Smith', role: 'Backend Developer' },
  { name: 'Carol Williams', role: 'UI/UX Designer' },
];

export default function About() {
  return (
    <>
      <div className="bg-dark text-white py-5">
        <Container className="py-4 text-center">
          <h1 className="display-5 fw-bold">About Us</h1>
          <p className="lead text-white-50">
            Learn more about our mission and the team behind SDS Component.
          </p>
        </Container>
      </div>

      <Container className="py-5">
        <Row className="align-items-center mb-5">
          <Col lg={6} className="mb-4 mb-lg-0">
            <h2 className="fw-bold mb-3">Our Mission</h2>
            <p className="text-muted">
              We believe in building high-quality, reusable components that
              accelerate development and deliver outstanding user experiences.
              Our focus is on simplicity, performance, and accessibility.
            </p>
            <p className="text-muted">
              SDS Component is designed to be a starting point for modern web
              applications, combining the power of React with the styling
              flexibility of Bootstrap 5.
            </p>
          </Col>
          <Col lg={6}>
            <div className="bg-primary bg-opacity-10 rounded-3 p-5 text-center">
              <h3 className="text-primary fw-bold display-1">SDS</h3>
              <p className="text-muted mb-0">Simple. Dynamic. Scalable.</p>
            </div>
          </Col>
        </Row>

        <h2 className="fw-bold text-center mb-4">Meet the Team</h2>
        <Row className="g-4">
          {team.map((member, idx) => (
            <Col md={4} key={idx}>
              <Card className="text-center border-0 shadow-sm h-100">
                <Card.Body className="py-4">
                  <div
                    className="bg-secondary bg-opacity-25 rounded-circle d-inline-flex align-items-center justify-content-center mb-3"
                    style={{ width: 80, height: 80 }}
                  >
                    <span className="fs-3 fw-bold text-secondary">
                      {member.name.charAt(0)}
                    </span>
                  </div>
                  <Card.Title className="fw-semibold">{member.name}</Card.Title>
                  <Card.Text className="text-muted">{member.role}</Card.Text>
                </Card.Body>
              </Card>
            </Col>
          ))}
        </Row>
      </Container>
    </>
  );
}
