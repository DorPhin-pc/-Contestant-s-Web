import React, { Component } from 'react';
import {
  Button,
  Card,
  CardHeader,
  CardBody,
  FormGroup,
  Form,
  Input,
  Container,
  Row,
  Col,
  UncontrolledTooltip,
} from 'reactstrap';
import emailjs from 'emailjs-com';

export default class Contact extends Component {
  sendEmail(e) {
    e.preventDefault();
    emailjs
      .sendForm('gmail', 'contestants', e.target, 'user_7iyTqTbLD0GITM2hqwzck')
      .then(
        (result) => {
          alert('문의메일이 정상적으로 발송되었습니다 :)');
        },
        (error) => {
          alert('메일 전송에 실패했어요 :(');
        }
      );
  }

  render() {
    return (
      <section className='section'>
        <Container>
          <Row>
            <Col md='6'>
              <Card className='card-plain'>
                <CardHeader>
                  <h1 className='profile-title text-left'>문의하기</h1>
                </CardHeader>
                <CardBody>
                  <Form onSubmit={this.sendEmail}>
                    <Row>
                      <Col md='6'>
                        <FormGroup>
                          <label>이름</label>
                          <Input
                            name='from_name'
                            placeholder='이름을 입력해주세요.'
                            type='text'
                          />
                        </FormGroup>
                      </Col>
                      <Col md='6'>
                        <FormGroup>
                          <label>이메일 주소</label>
                          <Input
                            name='from_email'
                            placeholder='example@naver.com'
                            type='email'
                          />
                        </FormGroup>
                      </Col>
                    </Row>
                    <Row>
                      <Col md='6'>
                        <FormGroup>
                          <label>핸드폰 번호</label>
                          <Input
                            name='phone_number'
                            placeholder='010-1232-1345'
                            type='text'
                          />
                        </FormGroup>
                      </Col>
                      <Col md='6'>
                        <FormGroup>
                          <label>학교/학과</label>
                          <Input
                            name='etc_info'
                            placeholder='한림대학교/경영학과'
                            type='text'
                          />
                        </FormGroup>
                      </Col>
                    </Row>
                    <Row>
                      <Col md='12'>
                        <FormGroup>
                          <label>문의주실 내용</label>
                          <Input
                            name='contents'
                            placeholder='공모자들에게 무엇이 궁금하신가요?'
                            type='text'
                          />
                        </FormGroup>
                      </Col>
                    </Row>
                    <Button
                      className='btn-round float-right'
                      color='primary'
                      data-placement='right'
                      id='tooltip341148792'
                      type='submit'
                    >
                      SEND
                    </Button>
                    <UncontrolledTooltip
                      delay={0}
                      placement='right'
                      target='tooltip341148792'
                    >
                      공모자들에게 문의내용을 보냅니다.
                    </UncontrolledTooltip>
                  </Form>
                </CardBody>
              </Card>
            </Col>
            <Col className='ml-auto' md='4'>
              <div className='info info-horizontal'>
                <div className='icon icon-primary'>
                  <i className='tim-icons icon-mobile' />
                </div>
                <div className='description'>
                  <h4 className='info-title'>무엇이 궁금하신가요?</h4>
                  <hr />
                  <p>김성원</p>

                  <p>sungwonkim8030@gmail.com</p>
                </div>
              </div>
            </Col>
          </Row>
        </Container>
      </section>
    );
  }
}
