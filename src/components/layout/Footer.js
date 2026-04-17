import React from 'react';
import { Container } from 'react-bootstrap';

export default function Footer() {
  return (
    <footer className="bg-dark text-light py-4 mt-auto">
      <Container className="text-center">
        <p className="mb-0">
          &copy; {new Date().getFullYear()} SDS Component. All rights reserved.
        </p>
      </Container>
    </footer>
  );
}
