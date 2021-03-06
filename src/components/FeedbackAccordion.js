import React, { useEffect, useState } from "react";
import { makeStyles } from "@material-ui/core/styles";
import Accordion from "@material-ui/core/Accordion";
import AccordionSummary from "@material-ui/core/AccordionSummary";
import AccordionDetails from "@material-ui/core/AccordionDetails";
import Typography from "@material-ui/core/Typography";
import ExpandMoreIcon from "@material-ui/icons/ExpandMore";
import BorderColorIcon from "@material-ui/icons/BorderColor";
import DeleteForeverIcon from "@material-ui/icons/DeleteForever";
import CheckCircleOutlineIcon from "@material-ui/icons/CheckCircleOutline";
import { confirmAlert } from "react-confirm-alert";
import * as Ref from "../config/firebase";
import { Badge } from "reactstrap";
import "../styles/main.css";

const useStyles = makeStyles((theme) => ({
   root: {
      width: "100%",
   },
   heading: {
      fontSize: theme.typography.pxToRem(15),
      fontWeight: theme.typography.fontWeightRegular,
   },
}));

export default function FeedbackAccordion(props) {
   const classes = useStyles();
   const [feedback, setFeedback] = useState([]);
   const [updateFeedback, setUpdateFeedback] = useState("");
   const [selectedFeedback, setSelectedFeedback] = useState("");

   const { selectedSeason, detailTitle, meetingLog } = props;
   useEffect(() => {
      Ref.teamList_Ref.child(`${selectedSeason}/${detailTitle}/teamDay/${meetingLog}/feedbacks`).on("value", (snapShot) => {
         setFeedback([]);
         snapShot.forEach(function (childSnapShot) {
            console.log(childSnapShot.val());
            setFeedback((oldArray) => [...oldArray, childSnapShot.val()]);
         });
      });
   }, [detailTitle, meetingLog, selectedSeason]);
   const handleSelectFeedback = (index) => {
      if (feedback[index].userUID === props.userUID) {
         setSelectedFeedback(index);
      }
   };
   const handleUpdateFeedback = (index) => {
      Ref.teamList_Ref.child(`${selectedSeason}/${detailTitle}/teamDay/${meetingLog}/feedbacks/${feedback[index].feedbackUID}`).update({
         feedback: updateFeedback,
      });
      setSelectedFeedback("");
   };
   const handleDeleteFeedback = (index) => {
      if (feedback[index].userUID === props.userUID) {
         confirmAlert({
            title: "해당 피드백을 삭제하시겠습니까?",
            message: "삭제된 이후에는 복구가 불가능합니다.",
            buttons: [
               {
                  label: "삭제",
                  onClick: () => {
                     Ref.teamList_Ref.child(`${selectedSeason}/${detailTitle}/teamDay/${meetingLog}/feedbacks/${feedback[index].feedbackUID}`).remove();
                  },
               },
               {
                  label: "취소",
                  onClick: () => {},
               },
            ],
         });
      }
   };

   return (
      <div className={classes.root}>
         {feedback.map((con, index) => {
            return (
               <div key={index}>
                  {selectedFeedback === index ? (
                     <Accordion key={index}>
                        <AccordionSummary expandIcon={<ExpandMoreIcon />} aria-controls="panel1a-content" id="panel1a-header">
                           <Typography className={classes.heading}>
                              <Badge size="bg" color="primary">
                                 {con.userName}
                              </Badge>
                              &emsp;
                              <small>{con.date}</small>
                           </Typography>
                        </AccordionSummary>
                        <AccordionDetails>
                           <textarea onChange={(e) => setUpdateFeedback(e.target.value)} id="feedbackAccordionTextArea" defaultValue={con.feedback}></textarea>
                        </AccordionDetails>
                        <div id="feedbackAccordionIcon">
                           <CheckCircleOutlineIcon onClick={() => handleUpdateFeedback(index)} />
                           &ensp;
                           <DeleteForeverIcon />
                        </div>
                     </Accordion>
                  ) : (
                     <Accordion key={index}>
                        <AccordionSummary expandIcon={<ExpandMoreIcon />} aria-controls="panel1a-content" id="panel1a-header">
                           <Typography className={classes.heading}>
                              <Badge size="bg" color="primary">
                                 {con.userName}
                              </Badge>
                              &emsp;
                              <small>{con.date}</small>
                           </Typography>
                        </AccordionSummary>
                        <AccordionDetails>
                           <Typography>{con.feedback}</Typography>
                        </AccordionDetails>
                        <div id="feedbackAccordionIcon">
                           <BorderColorIcon onClick={() => handleSelectFeedback(index)} />
                           &ensp;
                           <DeleteForeverIcon onClick={() => handleDeleteFeedback(index)} />
                        </div>
                     </Accordion>
                  )}
               </div>
            );
         })}
      </div>
   );
}
