import React from "react";
// nodejs library that concatenates classes
import classnames from "classnames";
import { teamList_Ref, UserDBRef } from "../../config/firebase";

// reactstrap components
import { Nav, NavItem, NavLink, TabContent, TabPane, Container, Col, Card, CardBody, Row, Button, Modal, Badge, FormGroup, Label, Input } from "reactstrap";

import * as firebase from "firebase/app";
// core components

import DemoNavbar from "../../components/Navbars/DemoNavbar.js";
import CardsFooter from "../../components/Footers/CardsFooter.js";
import Background from "../IndexSections/Background";
import TeamList from "../IndexSections/TeamList";
import RowTabs from "../../components/Contents/RowTabs";

import { confirmAlert } from "react-confirm-alert";
import "react-confirm-alert/src/react-confirm-alert.css"; // Import css

import { connect } from "react-redux";
import * as actions from "../../actions";
import lottieDay from "../../lotties/Day.json";

class Day extends React.Component {
   constructor(props) {
      super(props);
      this.state = {
         TeamInfo: [],
         isLoading: false,
         isDetail: false,
         isEditable: false,
         detailTitle: "",
         TeamMate: [],
         Day_Data: [],
         Day_Data_test: [],
         teamIndex: 0,
         Season: [],
         selectedSeason: "",
         date: new Date().toISOString().split("T")[0],
         selectedMeetingLogName: "",
         value: "",
         users: [],
      };
   }

   componentDidMount() {
      document.documentElement.scrollTop = 0;
      document.scrollingElement.scrollTop = 0;

      UserDBRef.once("value", (snap) => {
         for (const i in snap.val()) {
            this.state.users.push(i);
         }
      });
   }
   componentWillMount() {
      this.readSeason();
      const { fetchUserData, getUserData } = this.props;

      firebase.auth().onAuthStateChanged(function (userState) {
         if (userState) {
            fetchUserData(userState.displayName, userState.email, userState.uid);
            getUserData(userState.displayName, userState.uid);
         }
      });
   }

   // TODO: 데이터 추가시, 추가된 데이터만 state에 추가 (현 문제 : 추가된 데이터가 아니라 DB 맨 마지막에 있는 데이터가 state에 추가됨)
   readSeason() {
      teamList_Ref.once("value", (snap) => {
         for (const i in snap.val()) {
            console.log(i);
            this.setState({
               Season: this.state.Season.concat({
                  season: i,
               }),
               selectedSeason: i,
            });
         }
      });
   }

   toggleModal = (state) => {
      if (state === "seasonModal" || state === "addTeamModal" || state === "memberModal") {
         if (this.props.user.isSupporter) {
            this.setState({
               [state]: !this.state[state],
            });
         } else {
            alert("서포터즈 전용 메뉴입니다.");
            return;
         }
      } else if (state === "meetingLogModal") {
         // TODO: supporter === 해당 권한자만으로
         if (this.props.user.isSupporter) {
            this.setState({
               [state]: !this.state[state],
            });
         } else {
            for (const i in this.state.TeamMate) {
               if (this.state.TeamMate[i].UID === this.props.user.userUID) {
                  this.setState({
                     [state]: !this.state[state],
                  });
                  return;
               }
            }
            alert("허가된 사용자만 가능합니다.");
         }
      }
   };

   handleChange = (event) => {
      this.setState({ value: event.target.value });
   };

   TeamHandleSubmit = (event) => {
      if (this.state.value === "") {
         alert("팀명을 입력해주세요.");
         return;
      }
      this.CreateTeam(this.state.value);
   };

   MemberHandleSubmit = (event) => {
      if (this.state.value === "") {
         alert("팀원을 선택해주세요.");
         event.preventDefault();
         return;
      }
      event.preventDefault();
      this.AddTeamMember(this.state.value);
   };

   AddTeamMember = (memberData) => {
      const { detailTitle } = this.state;
      alert(`[${memberData}] 님을 추가합니다.`);

      var Name = memberData.split("(")[0];
      var UID = memberData.split("(")[1];
      UID = UID.slice(0, -1);

      teamList_Ref.child(`${this.state.selectedSeason}/` + detailTitle + "/team_member/" + Name).set(
         {
            memberName: Name,
            memberUID: UID,
         },
         function () {
            alert("추가 완료!");
         }
      );
   };

   addMeetingLog = (e) => {
      e.preventDefault();
      const { detailTitle, date, selectedSeason, dayDataCount } = this.state;

      teamList_Ref.child(`${selectedSeason}/${detailTitle}/teamDay/${date}`).set({
         tabsTitle: date,
         tabs: dayDataCount + 1,
      });
   };

   CreateTeam(value) {
      console.log(value);
      teamList_Ref.child(`${this.state.selectedSeason}/` + value).set({
         title: value,
      });
   }

   readTeam(select) {
      var data;
      teamList_Ref.child(`${select}/`).on("value", (snap) => {
         data = [];
         for (const i in snap.val()) {
            console.log(i);
            data.push({ title: i });
         }
         this.setState({
            isLoading: true,
            TeamInfo: data,
         });
      });
   }

   Read_Day_Data(title) {
      var count = 0;
      var data;
      teamList_Ref.child(`${this.state.selectedSeason}/${title}/teamDay`).on("value", (snap) => {
         data = [];
         for (const i in snap.val()) {
            console.log(i);
            teamList_Ref.child(`${this.state.selectedSeason}/` + title + "/teamDay/" + i).once("value", (snap) => {
               const dataSnap = snap.val();
               data.push({
                  tabsTitle: dataSnap.tabsTitle,
                  tabsSubTitle: dataSnap.tabsSubTitle,
                  opinion: dataSnap.opinion,
                  feedback: dataSnap.feedback,
                  etc: dataSnap.etc,
                  tabs: dataSnap.tabs,
               });
            });
            count += 1;
         }
         this.setState({
            dayDataCount: count,
            Day_Data: data,
         });
      });
      this.props.getTeamDataFromFB(this.state.selectedSeason, title);
   }

   Read_Team_Member(title) {
      var data;
      teamList_Ref.child(`${this.state.selectedSeason}/${title}/team_member`).on("value", (snap) => {
         data = [];
         snap.forEach(function (snapShot) {
            // console.log(snapShot.val());
            data.push({
               name: snapShot.child("memberName").val(),
               UID: snapShot.child("memberUID").val(),
            });
         });
      });
      this.setState({
         isLoading: true,
         TeamMate: data,
      });
   }

   toggleNavs = (e, state, index, selectName) => {
      e.preventDefault();
      this.setState({
         [state]: index,
         selectedSeason: selectName,
      });
      this.readTeam(selectName);
   };

   OnDetail = (title) => {
      this.Read_Team_Member(title);
      this.Read_Day_Data(title);
      // alert(title);
      this.setState({
         isDetail: true,
         detailTitle: title,
      });
   };

   OffDetail = () => {
      this.setState({
         isDetail: false,
         detailTitle: "",
         TeamMate: [],
         Day_Data: [],
      });
   };

   DeleteClickHandler = (index, title) => {
      if (this.props.user.isSupporter) {
         alert(`[${title}]팀을 삭제합니다.`);
         window.location.reload();
         teamList_Ref.child(`${this.state.selectedSeason}/` + title).remove();
      }
   };

   seasonHandleSubmit = (event) => {
      if (this.state.value === "") {
         alert("시즌 이름을 입력해주세요.");
         event.preventDefault();
         return;
      }

      this.addSeason(this.state.value);
   };

   selectedMeetingLog = (name) => {
      this.setState({
         selectedMeetingLogName: name,
      });
   };

   addSeason(seasonName) {
      teamList_Ref.child(`${seasonName}/DUMMY`).set({
         title: "새로운 팀 생성 후, 삭제해주세요.",
      });
   }
   trashClickEvent = () => {
      if (this.props.user.isSupporter) {
         const { selectedSeason, detailTitle, selectedMeetingLogName } = this.state;
         console.log("trash");
         confirmAlert({
            title: "해당 회의록을 삭제하시겠습니까?",
            message: "삭제된 이후에는 복구가 불가능합니다.",
            buttons: [
               {
                  label: "삭제",
                  onClick: () => {
                     // console.log(selectedSeason, detailTitle, selectedMeetingLogName);
                     teamList_Ref.child(`${selectedSeason}/${detailTitle}/teamDay/${selectedMeetingLogName}`).remove();
                  },
               },
               {
                  label: "취소",
                  onClick: () => {},
               },
            ],
         });
      } else {
         alert("허가된 사용자만 가능합니다.");
      }
   };

   render() {
      const ready = false;
      const { isAuth, isSupporter } = this.props.user;

      return (
         <div>
            <DemoNavbar />
            <Background lottieName={lottieDay} title="공모자의 하루" desc="회의 및 프로젝트 진행상황을 보고합니다." />
            {isAuth || isSupporter ? (
               ready ? (
                  <h1 style={{ textAlign: "center" }}>
                     <span role="img" aria-label="work">
                        😭작업 중에 있습니다😭
                     </span>
                  </h1>
               ) : (
                  <section className="section section-lg pt-lg-0 mt--200">
                     <Container>
                        <Col className="mt-5 mt-lg-0" lg="12">
                           {/* Menu */}
                           <div className="mb-3">
                              <h5 className="text-uppercase font-weight-bold text-white">
                                 학기 선택&emsp;
                                 <Badge color="primary" pill className="mr-1" type="button" onClick={() => this.toggleModal("seasonModal")}>
                                    학기 추가
                                 </Badge>
                                 <Modal className="modal-dialog-centered" isOpen={this.state.seasonModal} toggle={() => this.toggleModal("seasonModal")}>
                                    <div className="modal-header">
                                       <h6 className="modal-title" id="modal-title-default">
                                          학기 추가
                                       </h6>
                                       <button aria-label="Close" className="close" data-dismiss="modal" type="button" onClick={() => this.toggleModal("seasonModal")}>
                                          <span aria-hidden={true}>×</span>
                                       </button>
                                    </div>
                                    <form onSubmit={this.seasonHandleSubmit}>
                                       <div className="modal-body">
                                          <input type="text" onChange={this.handleChange} placeholder="학기 명을 입력해주세요."></input>
                                       </div>
                                       <div className="modal-footer">
                                          <Button color="primary" type="submit" onClick={() => this.toggleModal("seasonModal")}>
                                             작성
                                          </Button>
                                          <Button className="ml-auto" color="link" data-dismiss="modal" type="button" onClick={() => this.toggleModal("seasonModal")}>
                                             취소
                                          </Button>
                                       </div>
                                    </form>
                                 </Modal>
                              </h5>
                           </div>
                           <div className="nav-wrapper">
                              <Nav className="nav-fill flex-column flex-md-row" id="tabs-icons-text" pills role="tablist">
                                 {this.state.Season.map((con, i) => {
                                    return (
                                       <NavItem key={i}>
                                          <NavLink
                                             aria-selected={this.state.seasonPlainTabs === i + 1}
                                             className={classnames("mb-sm-3 mb-md-0", {
                                                active: this.state.seasonPlainTabs === i + 1,
                                             })}
                                             onClick={(e) => this.toggleNavs(e, "seasonPlainTabs", i + 1, con.season)}
                                             href="#pablo"
                                             role="tab"
                                          >
                                             {con.season}
                                          </NavLink>
                                       </NavItem>
                                    );
                                 })}
                              </Nav>
                           </div>
                           <Card className="shadow">
                              <CardBody>
                                 <TabContent activeTab={"plainTabs" + this.state.plainTabs}>
                                    <TabPane tabId={"plainTabs" + this.state.plainTabs}>
                                       <Container>
                                          {this.state.isDetail ? (
                                             <Row>
                                                <Col lg="2">
                                                   <Button block color="primary" type="button" onClick={() => this.OffDetail()}>
                                                      팀 목록으로
                                                   </Button>
                                                </Col>
                                                <Col lg="2">
                                                   <Button block color="success" type="button" onClick={() => this.toggleModal("memberModal")}>
                                                      팀원추가
                                                   </Button>
                                                   <Modal className="modal-dialog-centered" isOpen={this.state.memberModal} toggle={() => this.toggleModal("memberModal")}>
                                                      <div className="modal-header">
                                                         <h6 className="modal-title" id="modal-title-default">
                                                            신규 팀원 추가
                                                         </h6>
                                                         <button aria-label="Close" className="close" data-dismiss="modal" type="button" onClick={() => this.toggleModal("memberModal")}>
                                                            <span aria-hidden={true}>×</span>
                                                         </button>
                                                      </div>
                                                      <form onSubmit={this.MemberHandleSubmit}>
                                                         <div className="modal-body">
                                                            {this.state.users.map((con, i) => {
                                                               return (
                                                                  <FormGroup check key={i}>
                                                                     <Label check>
                                                                        <Input name="radio" value={con} type="radio" onChange={this.handleChange} /> {con}
                                                                     </Label>
                                                                  </FormGroup>
                                                               );
                                                            })}
                                                            {/* <input
                                          type='text'
                                          onChange={this.handleChange}
                                          placeholder='팀원 이름을 입력해주세요.'
                                        ></input> */}
                                                         </div>
                                                         <div className="modal-footer">
                                                            <Button color="primary" type="submit" onClick={() => this.toggleModal("memberModal")}>
                                                               팀원 추가
                                                            </Button>
                                                            <Button className="ml-auto" color="link" data-dismiss="modal" type="button" onClick={() => this.toggleModal("memberModal")}>
                                                               취소
                                                            </Button>
                                                         </div>
                                                      </form>
                                                   </Modal>
                                                </Col>
                                                <Col lg="2">
                                                   <Button block color="info" type="button" onClick={() => this.toggleModal("meetingLogModal")}>
                                                      회의록추가
                                                   </Button>
                                                   <Modal className="modal-dialog-centered" isOpen={this.state.meetingLogModal} toggle={() => this.toggleModal("meetingLogModal")}>
                                                      <div className="modal-header">
                                                         <h6 className="modal-title" id="modal-title-default">
                                                            회의록 작성
                                                         </h6>
                                                         <button aria-label="Close" className="close" data-dismiss="modal" type="button" onClick={() => this.toggleModal("meetingLogModal")}>
                                                            <span aria-hidden={true}>×</span>
                                                         </button>
                                                      </div>
                                                      <form onSubmit={this.addMeetingLog}>
                                                         <div className="modal-body">
                                                            <small className="text-uppercase text-muted font-weight-bold">
                                                               회의록 작성 날짜
                                                               <br />
                                                               <h4 className="display-4 mb-0">{this.state.date}</h4>
                                                            </small>
                                                         </div>
                                                         <div className="modal-footer">
                                                            <Button color="primary" type="submit" onClick={() => this.toggleModal("meetingLogModal")}>
                                                               작성
                                                            </Button>
                                                            <Button className="ml-auto" color="link" data-dismiss="modal" type="button" onClick={() => this.toggleModal("meetingLogModal")}>
                                                               취소
                                                            </Button>
                                                         </div>
                                                      </form>
                                                   </Modal>
                                                </Col>
                                                <Col lg="6">
                                                   <Button block color="warning">
                                                      #{this.state.detailTitle}
                                                   </Button>
                                                </Col>
                                             </Row>
                                          ) : (
                                             ""
                                          )}
                                          <Modal className="modal-dialog-centered" isOpen={this.state.addTeamModal} toggle={() => this.toggleModal("addTeamModal")}>
                                             <div className="modal-header">
                                                <h6 className="modal-title" id="modal-title-default">
                                                   신규 팀 생성
                                                </h6>
                                                <button aria-label="Close" className="close" data-dismiss="modal" type="button" onClick={() => this.toggleModal("addTeamModal")}>
                                                   <span aria-hidden={true}>×</span>
                                                </button>
                                             </div>
                                             <form onSubmit={this.TeamHandleSubmit}>
                                                <div className="modal-body">
                                                   <input type="text" onChange={this.handleChange} placeholder="팀 이름을 입력해주세요."></input>
                                                </div>
                                                <div className="modal-footer">
                                                   <Button color="primary" type="submit" onClick={() => this.toggleModal("addTeamModal")}>
                                                      팀 생성
                                                   </Button>
                                                   <Button className="ml-auto" color="link" data-dismiss="modal" type="button" onClick={() => this.toggleModal("addTeamModal")}>
                                                      취소
                                                   </Button>
                                                </div>
                                             </form>
                                          </Modal>
                                          <Row className="justify-content-center">
                                             <Col lg="12">
                                                <Row className="row-grid">
                                                   {/* 팀 목록 리스트 뿌려주기 */}
                                                   {this.state.isLoading ? (
                                                      this.state.isDetail ? (
                                                         <Col>
                                                            <h1>{this.state.detailTitle}</h1>
                                                            {this.state.TeamMate.map((con, i) => {
                                                               return (
                                                                  <Badge color="primary" pill className="mr-1" key={i}>
                                                                     {con.name}
                                                                  </Badge>
                                                               );
                                                            })}
                                                            <RowTabs
                                                               day_data={this.state.Day_Data}
                                                               trashClickEvent={this.trashClickEvent}
                                                               changeSelectedName={this.selectedMeetingLog}
                                                               selectedSeason={this.state.selectedSeason}
                                                               detailTitle={this.state.detailTitle}
                                                            />
                                                         </Col>
                                                      ) : (
                                                         <>
                                                            <Button block className="mb-3" color="primary" type="button" onClick={() => this.toggleModal("addTeamModal")}>
                                                               팀 추가하기
                                                            </Button>
                                                            {this.state.TeamInfo.map((con, i) => {
                                                               return (
                                                                  <TeamList
                                                                     JoinClickHandler={() => this.OnDetail(con.title)}
                                                                     DeleteClickHandler={() => this.DeleteClickHandler(i, con.title)}
                                                                     key={i}
                                                                     id={con.id}
                                                                     title={con.title}
                                                                     description={con.subtitle}
                                                                  />
                                                               );
                                                            })}
                                                         </>
                                                      )
                                                   ) : (
                                                      "시즌을 선택해주세요."
                                                   )}
                                                </Row>
                                             </Col>
                                          </Row>
                                       </Container>
                                    </TabPane>
                                 </TabContent>
                              </CardBody>
                           </Card>
                        </Col>
                     </Container>
                  </section>
               )
            ) : (
               <div>
                  <h1 style={{ textAlign: "center" }}>로그인/인증이 필요합니다.</h1>
                  <p style={{ textAlign: "center" }}>로그인/인증 문제가 생기셨다면 '공모자들' 서포터즈에게 연락주세요.</p>
               </div>
            )}

            <CardsFooter />
         </div>
      );
   }
}

const mapStateToProps = ({ user, data }) => {
   return {
      user,
      data,
   };
};

export default connect(mapStateToProps, actions)(Day);
