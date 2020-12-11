import React from 'react';
import { Col, Form, ProgressBar, Row, Button } from 'react-bootstrap';

export default function MessageForm() {
  return (
    <>
      <Form>
        <Form.Group controlId='exampleForm.ControlTextarea1'>
          <Form.Label>Example textarea</Form.Label>
          <Form.Control as='textarea' rows={3} />
        </Form.Group>
      </Form>
      <ProgressBar animated now={60} label='60%' />
      <Row style={{ marginTop: 10 }}>
        <Col>
          <Button style={{ width: '100%' }}>취소</Button>
        </Col>
        <Col>
          <Button style={{ width: '100%' }}>전송</Button>
        </Col>
      </Row>
    </>
  );
}
