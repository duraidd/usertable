import {
  AppBar,
  Button,
  Card,
  colors,
  MenuItem,
  Stack,
  TextField,
} from "@mui/material";
import React, { useEffect, useState } from "react";
import Modal from "@mui/material/Modal";
import Paper from "@mui/material/Paper";
import TableContainer from "@mui/material/TableContainer";
import Table from "@mui/material/Table";
import TableHead from "@mui/material/TableHead";
import TableCell, {tableCellClasses}  from "@mui/material/TableCell";
import TableRow from "@mui/material/TableRow";
import TableBody from "@mui/material/TableBody";
import Typography from "@mui/material/Typography";
import Zoom from "@mui/material/Zoom";
import Tooltip from "@mui/material/Tooltip";
import TableFooter from "@mui/material/TableFooter";
import Box from "@mui/material/Box";
import IconButton from "@mui/material/IconButton";
import Toolbar from "@mui/material/Toolbar";
import Pagination from "@mui/material/Pagination";
import axios from "axios";
import Swal from "sweetalert2";
import useStateRef from "react-usestateref";
import CloseIcon from "@mui/icons-material/Close";
import moment from "moment";
import AdapterDateFns from "@mui/lab/AdapterDateFns";
import LocalizationProvider from "@mui/lab/LocalizationProvider";
import DatePicker from "@mui/lab/DatePicker";
import { styled } from "@mui/system";
import Colors from "../Constant/Colors"

const StyledTableCell = styled(TableCell)(({ theme }) => ({
  [`&.${tableCellClasses.head}`]: {
    backgroundColor: Colors.MAIN_THEME_COLOR,
    color: "white",
  },
  [`&.${tableCellClasses.body}`]: {
    fontSize: 14,
  },
}));

const StyledTableRow = styled(TableRow)(({ theme }) => ({
  '&:nth-of-type(odd)': {
    backgroundColor: Colors.CUSTOMER_LIGHT_COLOR,
  },
  // hide last border
  '&:last-child td, &:last-child th': {
    border: 0,
  },
}));

const style = {
  position: "absolute",
  top: "50%",
  left: "50%",
  transform: "translate(-50%, -50%)",
  width: 300,
  bgcolor: "background.paper",
  border: "1px solid #000",
  boxShadow: 24,
  p: 2,
};

function Usertable() {
  const [data, setdata, dataRef] = useStateRef([]);
  const tableHeadName = ["Name", "Email", "Expiry Date", "Plan", "Actions"];
  const [page, setPage, pageRef] = useStateRef(1);
  const emptyRows = 0;
  const [countingNo, setcountingNo] = useState(0);
  const [gettingEmail, setgettingEmail, gettingEmailRef] = useStateRef("");
  const [open, setOpen] = useState(false);
  const [openplan, setOpenplan] = useState(false);
  const [plannedDate, setPlannedDate, plannedDateRef] = useStateRef("");
  let x = moment(plannedDateRef.current).toISOString();
  const plans = ["Free", "Pro", "Ultimate"];
  const [planUpdate, setPlanUpdate, planUpdateRef] = useStateRef("");
  const [myDate, setMyDate, myDateRef] = useStateRef("");

  const handleChangeTimeDate = (value) => {
    setPlannedDate(value);
  };

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
    getallData();
  };

  const handleBtnClickExpire = (e, obj) => {
    setOpen(true);
    let x = moment(obj.planExpiryDate).toISOString();
    setPlannedDate(x);
    setMyDate(obj.planExpiryDate);
    setgettingEmail(obj.emailId);
  };

  const handleBtnPlanUpgrade = (e, obj) => {
    setOpenplan(true);
    setgettingEmail(obj.emailId);
    setPlanUpdate(obj.plan);
  };

  const handleChangePlan = (e) => {
    setPlanUpdate(e.target.value);
  };

  const handleBtnClickRemove = (e, obj) => {
    Swal.fire({
      title: "Do you want to delete this?",
      showCancelButton: true,
      confirmButtonText: "Delete",
    }).then((result) => {
      if (result.isConfirmed) {
        axios
          .post("http://192.168.1.31:3002/adminRouter/deleteDB", {
            username: obj.emailId,
          })
          .then((res) => {
            if (res.data.success) {
              getallData();
            }
            Swal.fire(res.data.message, "", "success");
          });
      } else if (result.isDenied) {
        Swal.fire("Changes are not saved", "", "info");
      }
    });
  };

  const handleBtnClickBlock = (e, obj) => {
    axios
      .post("http://192.168.1.31:3002/adminRouter/suspendUser", {
        username: obj.emailId,
        suspendUser: !obj.suspendUser,
      })
      .then((res) => {
        if (res.data.success) {
          getallData();
        }
        Swal.fire(res.data.message);
      });
  };

  const handleExpireDate = () => {
    if (plannedDateRef.current === "") {
      alert("please fill the future expire date");
    } else {
      axios
        .post("http://192.168.1.31:3002/adminRouter/updateExpiryDate", {
          username: gettingEmailRef.current,
          planExpiryDate: plannedDateRef.current,
        })
        .then((res) => {
          if (res.data.success) {
            getallData();
          }
          Swal.fire({
            position: "center",
            icon: res.data.success ? "success" : "error",
            title: res.data.message,
            showConfirmButton: false,
            timer: 1500,
          });
        });

      // setMyDate(plannedDateRef.current);
      setOpen(!open);
    }
  };

  const handlePlanSubmit = () => {
    if (planUpdateRef.current === "") {
      alert("Please Select the Plan");
    } else {
      axios
        .post("http://192.168.1.31:3002/adminRouter/updatePlan", {
          username: gettingEmailRef.current,
          plan: planUpdateRef.current,
        })
        .then((res) => {
          if (res.data.success) {
            Swal.fire(res.data.message);
            getallData();
          }
        });
    }

    setOpenplan(!openplan);
  };

  const getallData = () => {
    axios
      .post("http://192.168.1.31:3002/adminRouter/getAllDataBase", {
        username: "admin",
        pageNo: pageRef.current,
        pageSize: 5,
        searchQuery: "",
      })
      .then((res) => {
        let datas = res.data;
        setdata(datas.data);
        setcountingNo(datas.count);
      });
  };

  useEffect(() => {
    getallData();
  }, []);

  return (
    <>
      <AppBar position="fixed">
        <Toolbar sx={{backgroundColor:Colors.MAIN_THEME_COLOR}} >
          <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
            Smart Tailoring Shop Admin Panel
          </Typography>
        </Toolbar>
      </AppBar>
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          alignItems: "center",
          paddingLeft: "1%",
          paddingRight: "1%",
        }}
      >
        <div style={{ width: "100%", flex: 2, paddingTop: "10%" }}>
          <Card elevation={5}>
            <TableContainer component={Paper}>
              <Table size="small" stickyHeader>
                <TableHead>
                  <StyledTableRow>
                    {tableHeadName.map((headName) => (
                      <StyledTableCell align="center">
                        <Typography variant="h5" sx={{ margin: "2%" }}>
                          {headName}
                        </Typography>
                      </StyledTableCell>
                    ))}
                  </StyledTableRow>
                </TableHead>
                <TableBody>
                  {dataRef.current.map((row) => (
                    <StyledTableRow>
                      <StyledTableCell align="center">
                        <Typography>{row.name}</Typography>
                      </StyledTableCell>
                      <StyledTableCell align="center">
                        <Typography>{row.emailId}</Typography>
                      </StyledTableCell>
                      <StyledTableCell align="center">
                        <Typography>
                          {" "}
                          {moment(row.planExpiryDate).format("DD-MM-YYYY")}{" "}
                        </Typography>
                      </StyledTableCell>
                      <StyledTableCell align="center">
                        <Typography>{row.plan}</Typography>
                      </StyledTableCell>
                      <StyledTableCell align="center">
                        <div
                          style={{
                            display: "flex",
                            flexDirection: "row",
                            justifyContent: "center",
                          }}
                        >
                          <Card
                            elevation="1"
                            style={{
                              display: "flex",
                              padding: "0.5%",
                              margin: "0.5%",
                              gap: "10px",
                            }}
                          >
                            <Tooltip
                              title={"Update Expire Time"}
                              arrow
                              TransitionComponent={Zoom}
                            >
                              <Button
                                size="small"
                                sx={{
                                  color: "white",
                                  backgroundColor: "#53BF9D",
                                  textTransform: "capitalize",
                                  "&:hover": { backgroundColor: "#53BF9D" },
                                }}
                                onClick={(e) => handleBtnClickExpire(e, row)}
                              >
                                {"Update Expire Time"}
                              </Button>
                            </Tooltip>
                            <Tooltip
                              title={"Block"}
                              arrow
                              TransitionComponent={Zoom}
                            >
                              <Button
                                size="small"
                                sx={{
                                  color: "white",
                                  backgroundColor: "#827397",
                                  textTransform: "capitalize",
                                  "&:hover": { backgroundColor: "#827397" },
                                }}
                                onClick={(e) => handleBtnClickBlock(e, row)}
                              >
                                {row.suspendUser ? "UnBlock" : "Block"}
                              </Button>
                            </Tooltip>
                            <Tooltip
                              title={"Remove"}
                              arrow
                              TransitionComponent={Zoom}
                            >
                              <Button
                                size="small"
                                sx={{
                                  color: "white",
                                  backgroundColor: "#F32424",
                                  textTransform: "capitalize",
                                  "&:hover": { backgroundColor: "#F32424" },
                                }}
                                onClick={(e) => handleBtnClickRemove(e, row)}
                              >
                                {"Remove"}
                              </Button>
                            </Tooltip>
                            <Tooltip
                              title={"Plan Upgrade"}
                              arrow
                              TransitionComponent={Zoom}
                            >
                              <Button
                                size="small"
                                sx={{
                                  color: "white",
                                  backgroundColor: "#B09B71",
                                  textTransform: "capitalize",
                                  "&:hover": { backgroundColor: "#B09B71" },
                                }}
                                onClick={(e) => handleBtnPlanUpgrade(e, row)}
                              >
                                {"Plan Upgrade"}
                              </Button>
                            </Tooltip>
                          </Card>
                        </div>
                      </StyledTableCell>
                    </StyledTableRow>
                  ))}
                  {emptyRows > 0 && (
                    <TableRow style={{ height: 30 * emptyRows }}>
                      <TableCell colSpan={6} />
                    </TableRow>
                  )}
                </TableBody>
              </Table>
              <TableFooter
                style={{
                  display: "flex",
                  justifyContent: "center",
                  marginTop: 15,
                  marginBottom: 15,
                }}
              >
                <TableRow>
                  <Pagination
                    variant="outlined"
                    shape="rounded"
                    showFirstButton
                    showLastButton
                    count={Math.ceil(countingNo / 5)}
                    page={pageRef.current}
                    onChange={handleChangePage}
                  />
                </TableRow>
              </TableFooter>
            </TableContainer>
          </Card>
        </div>

        <Modal open={open}>
          <Box sx={style}>
            <Stack flexDirection="row" justifyContent="flex-end">
              <IconButton onClick={() => setOpen(false)}>
                <CloseIcon sx={{ color: "red" }} />
              </IconButton>
            </Stack>
            <Stack
              gap="40px"
              direction="column"
              justifyContent="center"
              alignItems="center"
            >
              <Typography id="modal-modal-title" variant="h6" component="h2">
                Update Expire Time
              </Typography>

              <LocalizationProvider dateAdapter={AdapterDateFns}>
                <DatePicker
                  disablePast={true}
                  label="Date"
                  value={plannedDateRef.current}
                  inputFormat="dd/MM/yyyy"
                  onChange={(e) => handleChangeTimeDate(e)}
                  renderInput={(params) => <TextField {...params} />}
                />
              </LocalizationProvider>

              <Button
                size="small"
                sx={{
                  color: "white",
                  backgroundColor: "#1572A1",
                  textTransform: "capitalize",
                  "&:hover": { backgroundColor: "#1572A1" },
                }}
                onClick={handleExpireDate}
              >
                Submit
              </Button>
            </Stack>
          </Box>
        </Modal>

        <Modal open={openplan}>
          <Box sx={style}>
            <Stack flexDirection="row" justifyContent="flex-end">
              <IconButton onClick={() => setOpenplan(false)}>
                <CloseIcon sx={{ color: "red" }} />
              </IconButton>
            </Stack>
            <Stack
              gap="40px"
              direction="column"
              justifyContent="center"
              alignItems="center"
            >
              <Typography id="modal-modal-title" variant="h6" component="h2">
                Plan Upgrade
              </Typography>
              <TextField
                select
                fullWidth
                defaultValue={planUpdateRef.current}
                onChange={(e) => handleChangePlan(e)}
              >
                {plans.map((planName) => (
                  <MenuItem value={planName}>{planName}</MenuItem>
                ))}
              </TextField>

              <Button
                size="small"
                sx={{
                  color: "white",
                  backgroundColor: "#1572A1",
                  textTransform: "capitalize",
                  "&:hover": { backgroundColor: "#1572A1" },
                }}
                onClick={handlePlanSubmit}
              >
                Submit
              </Button>
            </Stack>
          </Box>
        </Modal>
      </div>
    </>
  );
}

export default Usertable;
