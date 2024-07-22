import React from "react";
import { Container, Row, Col } from "react-bootstrap";

const Home = () => {
  return (
    <Container className="my-5">
      <Row className="justify-content-center">
        <Col xs={12} md={8} lg={6}>
          <h1 className="text-center mb-4">Welcome to Our Company!</h1>
          <p className="text-center">
            We are excited to have you on board. Explore our departments and employees to get started.
          </p>
        </Col>
      </Row>
    </Container>
  );
};

export default Home;
