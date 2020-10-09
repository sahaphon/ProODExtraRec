
import React, { useState, useEffect, useRef } from "react";
import Cookie from "js-cookie";
import Axios from "axios";
import PropTypes from "prop-types";
import clsx from "clsx";
import LockOutlinedIcon from "@material-ui/icons/LockOutlined";
import CloseIcon from "@material-ui/icons/Close";
import WarningIcon from "@material-ui/icons/Warning";
import CheckCircleIcon from "@material-ui/icons/CheckCircle";
import ErrorIcon from "@material-ui/icons/Error";
import InfoIcon from "@material-ui/icons/Info";
import { amber, green } from "@material-ui/core/colors";
import Swal from 'sweetalert2';
import {
    makeStyles,
    Box,
    Typography,
    TextField,
    CssBaseline,
    Button,
    Avatar,
    Snackbar,
    IconButton,
    SnackbarContent
} from "@material-ui/core";
import Container from "@material-ui/core/Container";


function Copyright() {
    return (
        <Typography variant="body2" color="textSecondary" align="center">
            {"Copyright © Powered by ADDA "}
        </Typography>
    );
}

const variantIcon = {
    success: CheckCircleIcon,
    warning: WarningIcon,
    error: ErrorIcon,
    info: InfoIcon
};

const useStyles = makeStyles(theme => ({
    "@global": {
        body: {
            backgroundColor: theme.palette.common.white
        }
    },
    paper: {
        marginTop: theme.spacing(8),
        display: "flex",
        flexDirection: "column",
        alignItems: "center"
    },
    avatar: {
        margin: theme.spacing(1),
        backgroundColor: theme.palette.secondary.main
    },
    form: {
        width: "100%", // Fix IE 11 issue.
        marginTop: theme.spacing(1)
        // textTransform:"uppercase"
    },
    submit: {
        margin: theme.spacing(3, 0, 2),
        backgroundColor: "#1976d2"
    },
    success: {
        backgroundColor: green[600]
    },
    error: {
        backgroundColor: theme.palette.error.dark
    },
    info: {
        backgroundColor: theme.palette.primary.main
    },
    warning: {
        backgroundColor: amber[700]
    },
    icon: {
        fontSize: 20
    },
    iconVariant: {
        opacity: 0.9,
        marginRight: theme.spacing(1)
    },
    message: {
        display: "flex",
        alignItems: "center"
    },
    root: {
        minWidth: 400
    }
}));

MySnackbarContentWrapper.propTypes = {
    className: PropTypes.string,
    message: PropTypes.string,
    onClose: PropTypes.func,
    variant: PropTypes.oneOf(["error", "info", "success", "warning"]).isRequired
};

function MySnackbarContentWrapper(props) {
    const classes = useStyles();
    const { className, message, onClose, variant, ...other } = props;
    const Icon = variantIcon[variant];

    return (
        <div className={classes.root}>
            <SnackbarContent
                className={clsx(classes[variant], className)}
                // aria-describedby="client-snackbar"
                message={
                    <span id="client-snackbar" className={classes.message}>
                        <Icon className={clsx(classes.icon, classes.iconVariant)} />
                        {message}
                    </span>
                }
                action={[
                    <IconButton
                        key="close"
                        aria-label="close"
                        color="inherit"
                        onClick={onClose}
                    >
                        <CloseIcon className={classes.icon} />
                    </IconButton>
                ]}
                {...other}
            />
        </div>
    );
}

function SignIn(props) {
    const inputUser = useRef();
    const inputPass = useRef();
    const classes = useStyles();
    const [open, setOpen] = React.useState(false);
    const [values, setValues] = useState({
        userid: "",
        password: "",
        message: ""
    });

    //เปลี่ยนเป็นพิมพ์ใหญ่อัตโนมัติ
    const onHandelchang = name => e => {
        // console.log("------> ",name)
        if (name === 'userid')
        {
            setValues({ ...values, [name]: e.target.value.toUpperCase() });
        }
        else
        {
            setValues({ ...values, [name]: e.target.value });
        }
    };

    const logInuser = async e => {

       e.preventDefault();

       if (userid === '' || password === '')
       {
            Swal.fire({
                icon: 'error',
                title: 'คำเตือน',
                text: 'โปรดกรอก Username หรือ password ด้วย.'
            })
       }
       else
       {
        //    console.log("พาสเวิร์ส : ", password)
            Axios.post('http://10.32.1.169:5001/api/login_apprv', {
                username: userid, password: password
            }).then(res => {
                
                if (res.data.success === true) 
                {
                    //Split สตริงใส่ในตัวเเปรแต่ละตัว
                    // const [name, pfs_id, position] = res.data.data.split('/');
                    // console.log("รหัส​ : ", pfs_id);

                    Cookie.set("authorization", userid + ":" + res.data.token);
                    Cookie.set("person", res.data.data) //เก็บชื่อ รหัสพนง.
                    props.history.push("/main")
                }
                else {

                    //Clear ค่าตัวแปร password
                    setValues({ ...values, ['password']: '' });
                    
                    Swal.fire({
                        icon: 'error',
                        title: 'ผิดพลาด',
                        text: 'Username or password incorrect.'
                    })
                }
            })
       }
    };

    const handleClick = () => {
        setOpen(true);
    };

    const handleClose = (event, reason) => {
        if (reason === "clickaway") {
            return;
        }

        setOpen(false);
    };

    useEffect(() => {

    });
    
    const {userid,password} =values
    return (
        <Container className="animated fadeInDown" component="main" maxWidth="xs">
            <CssBaseline />
            <Snackbar
                className={classes.root}
                anchorOrigin={{
                    vertical: "top",
                    horizontal: "left"
                }}
                open={open}
                autoHideDuration={4500}
                onClose={handleClose}
            >
                <MySnackbarContentWrapper
                    onClose={handleClose}
                    variant="error"
                    message={values.message}
                    message="User name หรือ Password ผิด!"
                />
            </Snackbar>
            {/* <div className={classes.paper+" "+"animated"+" "+"fadeInDown"}> */}
            <div className={classes.paper}>
                <Avatar className={classes.avatar}>
                    <LockOutlinedIcon />
                </Avatar>
                <Typography style={{color:'green' }} component="h1" variant="h5">
                   โปรแกรมใบเปิด ORDER Online.
                </Typography>
                <form className={classes.form}>
                    <TextField
                        inputRef={inputUser}
                        variant="outlined"
                        margin="normal"
                        fullWidth
                        id="userid"
                        label="User Name"
                        name="userid"
                        autoComplete="off"
                        value={values.userid}
                        onChange={onHandelchang("userid")}
                        autoFocus
                    />
                    <TextField
                        // error ={true}
                        inputRef={inputPass}
                        variant="outlined"
                        margin="normal"
                        fullWidth
                        autoComplete="off"
                        name="password"
                        label="Password"
                        type="password"
                        id="password"
                        value={values.password}
                        onChange={onHandelchang("password")}
                    />
                    <Button
                        type="submit"
                        onClick={logInuser}
                        fullWidth
                        variant="contained"
                        color="primary"
                        className={classes.submit}
                    >
                       Login
          </Button>
                </form>
            </div>
            <Box mt={8}>
                <Copyright />
            </Box>
        </Container>
    );
}
export default SignIn;
