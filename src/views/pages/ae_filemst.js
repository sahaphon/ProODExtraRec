import React, { Component }  from 'react'
import {Card, CardHeader, CardBody, Col, Row, Button, Form, Input, FormGroup, Label} from "reactstrap";
import { BiSave, BiFolderOpen } from 'react-icons/bi';
import { Table } from 'antd';
import Axios from 'axios';
import moment from 'moment';
import Cookies from "js-cookie";
import { string } from 'prop-types';

class AeFiles extends Component
{
    state = {
        type: '',
        docno: '',
        name: '',
    }
 
    async componentDidMount()
    {
        let strType = '';
        let strId = '';
        let strName = '';

        if (this.props.match.path === '/main/filemst/add')
        {
           strType = 'ADD';
        }
        else
        {
           strType = 'EDIT';
           let str =  this.props.match.params.id;
           const [id, name] = str.split('~');
           strId = id;
           strName = name;
        }


        this.setState({ type : strType, docno: strId, name : strName })
        // console.log("13333", this.props.match.path)
        // console.log("id : ", this.props.match.params.id)
    }

    render() {

        return(
            <div>
                <Card>
                  <CardHeader style={{ backgroundColor: 'rgb(194, 214, 214)', color: 'blue' }}><BiFolderOpen style={{ color: 'black' }}/> ข้อมูลแฟ้มระบบงาน</CardHeader> 
                  <CardBody>
                    <Form>
                        <FormGroup>
                            <Row>
                                <Col md='1'>
                                    <Label style={{ display:'flex', justifyContent:'flex-end', paddingTop:'7px', fontSize:'13px', fontWeight:'bold' }} for="exampleEmail">รหัสแฟ้ม :</Label>
                                </Col>
                                <Col md='1' style={{ marginTop:'3px' }} >
                                    <Input style={{ color:'brown' }} type="custname" name="custname" id="custname" data-index='0' value={this.state.docno}/>
                                </Col>
                                <Col md='1'>
                                    <Label style={{ display:'flex', justifyContent:'flex-end', paddingTop:'7px', fontSize:'13px', fontWeight:'bold' }} for="exampleEmail">ชื่อแฟ้ม :</Label>
                                </Col>
                                <Col md='3'>
                                    <Input style={{ color:'brown' }} type="custname" name="custname" id="custname" data-index='0' value={this.state.name} />
                                </Col>
                                <Col md='6'>
                                    <Button color="success"><BiSave /> บันทึก1</Button>
                                    {/* <Button style={{ marginLeft: '5px' }} color="danger" ><BiLogOut /> ออกจากหน้าจอ</Button> */}
                                </Col>
                            </Row>
                        </FormGroup>
                    </Form>
                  </CardBody>
                </Card>
            </div>
        )
    }
}

export default AeFiles;