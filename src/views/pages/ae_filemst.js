import React, { Component }  from 'react'
import {Card, CardHeader, CardBody, Col, Row, Button, Form, Input, FormGroup, Label} from "reactstrap";
import { BiSave, BiFolderOpen, BiEditAlt } from 'react-icons/bi';
import { Table, Checkbox } from 'antd';
import Axios from 'axios';
import moment from 'moment';
import Cookies from "js-cookie";
import Sweet from 'sweetalert2';

import adminPic from '../../img/Admin-60.png';
import userPic from '../../img/users-60.png';
import lock from '../../img/lock_red.png';
import unlock from '../../img/unlock_green.png';

import customCss from '../../css/custom-tb.css';

class AeFiles extends Component
{
    state = {
        docno: '',
        name: '',
        data : [],
    }
 
    async componentDidMount()
    {
        console.log("ทำ DidMount")
        if (this.props.match.path === '/main/filemst/add')
        {
            let result = await Axios.post("http://10.32.1.169:5001/api/getusr")

            let myDt = [];
            if (result.data.length !== 0) 
            {
                result.data.data && result.data.data.map(v => {
                   
                    myDt.push({
                        level : v.act_user,
                        user : v.userid,
                        name : v.name,
                        pos : v.position,
                        act_open : 0,
                        act_view : 0,
                        act_add : 0,
                        act_edit : 0,
                        act_del : 0,
                        act_copy : 0,
                        act_print : 0,
                        act_other : 0,
                    })
                })
            }

            // console.log(myDt)
            this.setState({ data : myDt })
        }
        else  //กรณีแก้ไข 
        {
            console.log("ทำ Edit : ", this.props.match.params.id )
 
            let strId = this.props.match.params.id;
            let str = strId.split('~');
            let strNo = str[0];
            let strName = str[1];

            let result = await Axios.post("http://10.32.1.169:5001/api/loadfilemst", { docno : strNo})
            
            let myData = [];
            if (result.data.length !== 0) 
            {
                result.data.data && result.data.data.map(v => {
                   
                    myData.push({
                        level : v.act_user,
                        user : v.user_id,
                        name : v.name,
                        pos : v.position,
                        act_open : v.act_open === false ? 0 : 1,
                        act_view : v.act_view === false ? 0 : 1,
                        act_add : v.act_add === false ? 0 : 1,
                        act_edit : v.act_edit === false ? 0 : 1,
                        act_del : v.act_delete === false ? 0 : 1,
                        act_copy : v.act_copy === false ? 0 : 1,
                        act_print : v.act_print === false ? 0 : 1,
                        act_other : v.act_other === false ? 0 : 1,
                    })
                })

                // this.setState({ data : myData })
            }
            else{
                console.log("No data..")
            }

            console.log(myData);
            this.setState({ docno: strNo, name: strName, data: myData });
        }
    }

     handlerAddData = async (e) => {

        if (this.state.docno === '' || this.state.name === '')
        {
            Sweet.fire(
                'ผิดพลาด!',
                'โปรดกรอกข้อมูลให้ครบ ก่อนบันทึกข้อมูล!',
                'error'
              )
        }
        else
        {
            let fields = Cookies.get("authorization").split(":")
            let name = fields[0];
            
            let result = await Axios.post("http://10.32.1.169:5001/api/addfile", { docno : this.state.docno, name : this.state.name, user : name, data: this.state.data })

            // let myDt = [];
            if (result.data.length !== 0) 
            {
                if (result.data.exist === true)
                {
                    Sweet.fire(
                        'ผิดพลาด!',
                        'รหัสแฟ้มข้อมูลซ้ำ โปรดกรอกระบุอย่างอื่น..',
                        'error'
                      )
                }
                else
                {
                    this.props.history.push("/main/filemst"); 
                }

            }
        }
    }

    handlerEditData = async (e) =>
    {
        if (this.state.docno === '' || this.state.name === '')
        {
            Sweet.fire(
                'ผิดพลาด!',
                'โปรดกรอกข้อมูลให้ครบ ก่อนบันทึกข้อมูล!',
                'error'
              )
        }
        else
        {
            var fields = Cookies.get("authorization").split(":")
            let name = fields[0];
            
            let result = await Axios.post("http://10.32.1.169:5001/api/updatefile", { docno : this.state.docno, name : this.state.name, user : name, data: this.state.data })

            this.props.history.push("/main/filemst"); 
        }
    }

    handleClickCell = (_user, _action) => {

        //วิธี setState array of objects
        var myState = Object.assign({}, this.state);

        for (var i = 0; i < myState.data.length ; i++ )
        {
            if (myState.data[i].user === _user)
            {
                if (_action === 'act_open')
                {
                    myState.data[i].act_open = myState.data[i].act_open === 0 ? 1 : 0
                }
                else if (_action === 'act_view')
                {
                    myState.data[i].act_view = myState.data[i].act_view === 0 ? 1 : 0
                }
                else if (_action === 'act_add')
                {
                    myState.data[i].act_add = myState.data[i].act_add === 0 ? 1 : 0
                }
                else if (_action === 'act_edit')
                {
                    myState.data[i].act_edit = myState.data[i].act_edit === 0 ? 1 : 0
                }
                else if (_action === 'act_del')
                {
                    myState.data[i].act_del = myState.data[i].act_del === 0 ? 1 : 0
                }
                else if (_action === 'act_copy')
                {
                    myState.data[i].act_copy = myState.data[i].act_copy === 0 ? 1 : 0
                }
                else if (_action === 'act_print')
                {
                    myState.data[i].act_print = myState.data[i].act_print === 0 ? 1 : 0
                }
                else
                {
                    myState.data[i].act_other = myState.data[i].act_other === 0 ? 1 : 0
                }
                
            }
        }
       
        this.setState(myState);
    }

    onchangeCheckbox = (e, _action) => {
        console.log(`checked = ${e.target.checked}`);
        console.log("=>", _action)

         //วิธี setState array of objects
         var myState = Object.assign({}, this.state);

         for (var i = 0; i < myState.data.length ; i++ )
         {
                if (_action === 'act_open')
                {
                    myState.data[i].act_open = e.target.checked === true ? 1 : 0
                }
                else if (_action === 'act_view')
                {
                    myState.data[i].act_view = e.target.checked === true ? 1 : 0
                }
                else if (_action === 'act_add')
                {
                    myState.data[i].act_add = e.target.checked === true ? 1 : 0
                }
                else if (_action === 'act_edit')
                {
                    myState.data[i].act_edit = e.target.checked === true ? 1 : 0
                }
                else if (_action === 'act_del')
                {
                    myState.data[i].act_del = e.target.checked === true ? 1 : 0
                }
                else if (_action === 'act_copy')
                {
                    myState.data[i].act_copy = e.target.checked === true ? 1 : 0
                }
                else if (_action === 'act_print')
                {
                    myState.data[i].act_print = e.target.checked === true ? 1 : 0
                }
                else
                {
                    myState.data[i].act_other = e.target.checked === true ? 1 : 0
                }
         }
        
         this.setState(myState);
    }

    myColumns() 
    {
        const columns = [
            {
                title: '',
                dataIndex: '',
                width: '2%',
                render : (record) => (
                    <img src={record.level === 'A' ? adminPic : userPic } width='20' height='20'/>
                )
            }, {
                title: 'level',
                dataIndex: 'level',
                width: '2%',
            }, {
                title: 'User Login',
                dataIndex: 'user',
                width: '8%',
            }, {
                title: 'ชื่อ - นามสกุล',
                dataIndex: 'name',
            }, {
                title: 'ตำแหน่งงาน',
                dataIndex: 'pos',
            }, {
                title: () => (
                    <div>
                       <Label style={{ display:'flex', justifyContent:'center' }}>เปิด</Label>
                       <Checkbox style={{ display:'flex', justifyContent:'center' }} onChange={(e)=> this.onchangeCheckbox(e, 'act_open')} ></Checkbox>
                    </div>
                ),
                dataIndex: '',   //ถ้าจะใช้ record -> dataIndex ใส่เป็นค่าว่าง
                width: '5px',
                render : (record) => (
                        <center><a onDoubleClick={() => this.handleClickCell(record.user, 'act_open')} > {this.state.data.map(v => {
                          
                         if (v.user === record.user )
                         {
                            return v.act_open === 0 ? <img src={lock} /> : <img src={unlock} />
                         }
                         })}
                        </a></center>
                     )
            }, {
                title: () => (
                    <div>
                       <Label style={{ display:'flex', justifyContent:'center' }}>มุมมอง</Label>
                       <Checkbox style={{ display:'flex', justifyContent:'center' }} onChange={(e)=> this.onchangeCheckbox(e, 'act_view')}></Checkbox>
                    </div>
                ),
                dataIndex: '',
                width: '5px',
                render : (record) => (
                    <center><a onDoubleClick={() => this.handleClickCell(record.user, 'act_view')} > {this.state.data.map(v => {
                     if (v.user === record.user)
                     {
                        return v.act_view === 0 ? <img src={lock} /> : <img src={unlock} />
                     }
                     })}
                    </a></center>
                 )
            }, {
                title: () => (
                    <div>
                       <Label style={{ display:'flex', justifyContent:'center' }}>เพิ่ม</Label>
                       <Checkbox style={{ display:'flex', justifyContent:'center' }} onChange={(e)=> this.onchangeCheckbox(e, 'act_add')}></Checkbox>
                    </div>
                ),
                dataIndex: '',
                width: '5px',
                render : (record) => (
                    <center><a onDoubleClick={() => this.handleClickCell(record.user, 'act_add')} > {this.state.data.map(v => {
                     if (v.user === record.user)
                     {
                        return v.act_add === 0 ? <img src={lock} /> : <img src={unlock} />
                     }
                     })}
                    </a></center>
                 )
            }, {
                title: () => (
                    <div>
                       <Label style={{ display:'flex', justifyContent:'center' }}>แก้ไข</Label>
                       <Checkbox style={{ display:'flex', justifyContent:'center' }} onChange={(e)=> this.onchangeCheckbox(e, 'act_edit')}></Checkbox>
                    </div>
                ),
                dataIndex: '',
                width: '5px',
                render : (record) => (
                    <center><a onDoubleClick={() => this.handleClickCell(record.user, 'act_edit')} > {this.state.data.map(v => {

                     if (v.user === record.user)
                     {
                        return v.act_edit === 0 ? <img src={lock} /> : <img src={unlock} />
                     }
                     })}
                    </a></center>
                 )
            }, {
                title: () => (
                    <div>
                       <Label style={{ display:'flex', justifyContent:'center' }}>ลบ</Label>
                       <Checkbox style={{ display:'flex', justifyContent:'center' }} onChange={(e)=> this.onchangeCheckbox(e, 'act_del')}></Checkbox>
                    </div>
                ),
                dataIndex: '',
                width: '5px',
                render : (record) => (
                    <center><a onDoubleClick={() => this.handleClickCell(record.user, 'act_del')} > {this.state.data.map(v => {
                     if (v.user === record.user)
                     {
                        return v.act_del === 0 ? <img src={lock} /> : <img src={unlock} />
                     }
                     })}
                    </a></center>
                 )
            }, {
                title: () => (
                    <div>
                       <Label style={{ display:'flex', justifyContent:'center' }}>คัดลอก</Label>
                       <Checkbox style={{ display:'flex', justifyContent:'center' }} onChange={(e)=> this.onchangeCheckbox(e, 'act_copy')}></Checkbox>
                    </div>
                ),
                dataIndex: '',
                width: '5px',
                render : (record) => (
                    <center><a onDoubleClick={() => this.handleClickCell(record.user, 'act_copy')} > {this.state.data.map(v => {
                     if (v.user === record.user)
                     {
                        return v.act_copy === 0 ? <img src={lock} /> : <img src={unlock} />
                     }
                     })}
                    </a></center>
                 )
            }, {
                title: () => (
                    <div>
                       <Label style={{ display:'flex', justifyContent:'center' }}>พิมพ์</Label>
                       <Checkbox style={{ display:'flex', justifyContent:'center' }} onChange={(e)=> this.onchangeCheckbox(e, 'act_print')}></Checkbox>
                    </div>
                ),
                dataIndex: '',
                width: '5px',
                render : (record) => (
                    <center><a onDoubleClick={() => this.handleClickCell(record.user, 'act_print')} > {this.state.data.map(v => {
                     if (v.user === record.user)
                     {
                        return v.act_print === 0 ? <img src={lock} /> : <img src={unlock} />
                     }
                     })}
                    </a></center>
                 )
            }, {
                title: () => (
                    <div>
                       <Label style={{ display:'flex', justifyContent:'center' }}>อื่นๆ</Label>
                       <Checkbox style={{ display:'flex', justifyContent:'center' }} onChange={(e)=> this.onchangeCheckbox(e, 'act_other')}></Checkbox>
                    </div>
                ),
                dataIndex: '',
                width: '5px',
                render : (record) => (
                    <center><a onDoubleClick={() => this.handleClickCell(record.user, 'act_other')} > {this.state.data.map(v => {
                     if (v.user === record.user)
                     {
                        return v.act_other === 0 ? <img src={lock} /> : <img src={unlock} />
                     }
                     })}
                    </a></center>
                 )
            }];

        return columns;
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
                                    <Input style={{ color:'brown' }} type="id" name="id" id="id" data-index='0' value={this.state.docno} onChange={(e) => this.setState({ docno : e.target.value.toUpperCase() })}  disabled={ this.props.match.path === '/main/filemst/add' ? false : true }/>
                                </Col>
                                <Col md='1'>
                                    <Label style={{ display:'flex', justifyContent:'flex-end', paddingTop:'7px', fontSize:'13px', fontWeight:'bold' }} for="exampleEmail">ชื่อแฟ้ม :</Label>
                                </Col>
                                <Col md='3'>
                                    <Input style={{ color:'brown' }} type="name" name="name" id="name" data-index='1' value={this.state.name} onChange={(e) => this.setState({ name : e.target.value})} />
                                </Col>
                                <Col md='6'>
                                    {this.props.match.path === '/main/filemst/add' ?
                                    <Button color="success" onClick={this.handlerAddData}><BiSave /> บันทึกข้อมูล</Button>
                                    :
                                    <Button color="warning" onClick={this.handlerEditData}><BiEditAlt /> แก้ไขข้อมูล</Button>
                                 } 
                                </Col>
                            </Row>
                        </FormGroup>
                    </Form>
                    <Row style={{ marginTop: 10 }}>
                        <Col>
                            <Table className={customCss}
                                bordered
                                columns={ this.myColumns() }
                                dataSource={ this.state.data }
                            />
                        </Col>
                    </Row>
                  </CardBody>
                </Card>
            </div>
        )
    }
}

export default AeFiles;