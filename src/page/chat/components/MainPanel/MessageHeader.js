import React from 'react';
import {
  Accordion,
  Button,
  Card,
  Col,
  Container,
  FormControl,
  InputGroup,
  Row,
} from 'react-bootstrap';
import { FaLock } from 'react-icons/fa';
import { MdFavoriteBorder } from 'react-icons/md';
import { AiOutlineSearch } from 'react-icons/ai';

export default function MessageHeader() {
  return (
    <div
      style={{
        width: '100%',
        height: 170,
        border: '.2rem solid #ececec',
        padding: '1rem',
        marginBottom: '1rem',
      }}
    >
      <Container>
        <Row>
          <Col>
            <h2 style={{ display: 'flex', alignItems: 'center' }}>
              <FaLock /> ChatRoomName <MdFavoriteBorder />
            </h2>
          </Col>
          <Col>
            <InputGroup className='mb-3'>
              <InputGroup.Prepend>
                <InputGroup.Text id='basic-addon1'>
                  <AiOutlineSearch />
                </InputGroup.Text>
              </InputGroup.Prepend>
              <FormControl
                placeholder='Search Messages'
                aria-label='Search'
                aria-describedby='basic-addon1'
              />
            </InputGroup>
          </Col>
        </Row>

        <Row>
          <Col md={{ span: 4, offset: 8 }}>
            <p style={{ textAlign: 'end' }}>[icon] username</p>
          </Col>
        </Row>

        <Row>
          <Col>
            <Accordion defaultActiveKey='1'>
              <Card>
                <Card.Header style={{ padding: '0 1rem' }}>
                  <Accordion.Toggle as={Button} variant='link' eventKey='0'>
                    Description
                  </Accordion.Toggle>
                </Card.Header>
                <Accordion.Collapse eventKey='0'>
                  <Card.Body style={{ padding: '1rem 1rem' }}>Hello! I'm the body</Card.Body>
                </Accordion.Collapse>
              </Card>
            </Accordion>
          </Col>
          <Col>
            <Accordion defaultActiveKey='1'>
              <Card>
                <Card.Header style={{ padding: '0 1rem' }}>
                  <Accordion.Toggle as={Button} variant='link' eventKey='0'>
                    Count
                  </Accordion.Toggle>
                </Card.Header>
                <Accordion.Collapse eventKey='0'>
                  <Card.Body>Hello! I'm the body</Card.Body>
                </Accordion.Collapse>
              </Card>
            </Accordion>
          </Col>
        </Row>
      </Container>
    </div>
  );
}
