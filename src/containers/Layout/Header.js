import React from 'react'
import { withRouter  } from 'react-router-dom'
import {  UncontrolledDropdown, DropdownItem, DropdownMenu, DropdownToggle, Nav} from 'reactstrap'
import PropTypes from 'prop-types'
import {  AppNavbarBrand, AppSidebarToggler} from '@coreui/react'
import Cookies from "js-cookie";
import Axios from 'axios';
import Swal from 'sweetalert2';

const propTypes = {
    children: PropTypes.node,
}

const defaultProps ={}

class Header extends React.Component {

    handleLogout = async e => {

        const name = Cookies.get('authorization').split(':')[0]; 
        let result = await Axios.post("http://localhost:5001/api/logout_apprv", { username: name })  

        if (result.data.success === true) 
        {
            this.props.history.push("/")
        }
        else
        {
            Swal.fire(
                'ERROR!',
                'เกิดข้อผิดพลาด กรุณาลองใหม่อีกครั้ง',
                'error'
              )
        }
    }

    render() {
        // eslint-disable-next-line
        const { children, ...attributes } = this.props;

        return (
            <React.Fragment>
                <AppSidebarToggler className="d-lg-none" display="md" mobile />
                <AppNavbarBrand >
                    <img src={`${process.env.PUBLIC_URL}/img/logoOD.png`} className="img-fluid" alt="ADDAOnlineWholesale" />
                </AppNavbarBrand>

                <AppSidebarToggler className="d-md-down-none" display="lg" />
                <Nav className="ml-auto" navbar>

                    <UncontrolledDropdown nav direction="down">
                        
                        <DropdownToggle nav>
                        <span>สวัสดี {Cookies.get("person").split("/", 1)}</span>
                             <img src={`${process.env.PUBLIC_URL}/img/avatars/8.png`} className="img-avatar" alt="admin" />
                        </DropdownToggle>

                        <DropdownMenu right>
                            <DropdownItem header tag="div" className="text-center"><strong>ตั้งค่า</strong></DropdownItem>
                            <DropdownItem><i className="fa fa-user"></i> ข้อมูลผู้ใช้งาน</DropdownItem>
                            <DropdownItem><i className="fa fa-file"></i> ข้อมูลระบบงาน</DropdownItem>
                            <DropdownItem><i className="fa fa-key"></i> เปลี่ยนรหัสผ่าน</DropdownItem>                          
                            <DropdownItem onClick={() => {
                                  Swal.fire({
                                    title: 'Confirm logout?',
                                    text: "คุณต้องการออกจากระบบ ใช่หรือไม่!",
                                    icon: 'question',
                                    showCancelButton: true,
                                    confirmButtonColor: '#3085d6',
                                    cancelButtonColor: '#d33',
                                    cancelButtonText: 'ไม่ใช่',
                                    confirmButtonText: 'ใช่'
                                  }).then((result) => {
                    
                                    if (result.value === true)
                                    {      
                                         this.handleLogout()
                                    }
                                  })
                            }

                            }><i className="fa fa-lock"></i> ออกจากระบบ</DropdownItem>
                        </DropdownMenu>
                    </UncontrolledDropdown>
                </Nav>
            
           </React.Fragment>
        )
    }
}

Header.propTypes = propTypes;
Header.defaultProps = defaultProps;

export default withRouter(Header)