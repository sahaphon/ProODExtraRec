import React, { Component }  from 'react'
import {Card, CardHeader, CardBody, Col, Row, Button, Form, Input, FormGroup, Label} from "reactstrap";
import { BiSave, BiFolderOpen, BiEditAlt, BiTrash, BiPlusCircle } from 'react-icons/bi';
import { Table } from 'antd';
import Axios from 'axios';
import moment from 'moment';
import Cookies from "js-cookie";
import Sweet from 'sweetalert2';
import { ThreeSixty } from '@material-ui/icons';

class AeFiles extends Component
{
    state = {
        docno: '',
        name: '',
        data : [],
    }
 
    async componentDidMount()
    {
        // let strType = '';
        let strId = '';
        let strName = '';

        if (this.props.match.path === '/main/filemst/add')
        {
        //    strType = 'ADD';
        }
        else
        {
        //    strType = 'EDIT';
           let str =  this.props.match.params.id;
           const [id, name] = str.split('~');
           strId = id;
           strName = name;
        }

        //Query data
        // const [name, pfs_id, pos] = Cookies.get("person").split("/")
        var fields = Cookies.get("person").split("/")
        let name = fields[0];

        let result = await Axios.post("http://10.32.1.169:5001/api/files")

        let myDt = [];
        if (result.data.length !== 0) 
        {
            result.data.data && result.data.data.map(v => {
               
                myDt.push({
                    id : v.file_icon,
                    name : v.file_name,
                    pre_date : moment(v.pre_date).format("DD-MM-YYYY") === '01-01-1900' ? '' : moment(v.pre_date).format("DD-MM-YYYY"),
                    pre_by : v.pre_by,
                    last_date : moment(v.last_date).format("DD-MM-YYYY") === '01-01-1900' ? '' : moment(v.last_date).format("DD-MM-YYYY"),
                    last_by : v.last_by,
                })
            })

            // this.setState({ data : myDt });
        }

        this.setState({ docno: strId, name : strName, data : myDt })
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
            var fields = Cookies.get("authorization").split(":")
            let name = fields[0];
            
            let result = await Axios.post("http://10.32.1.169:5001/api/addfile", { docno : this.state.docno, name : this.state.name, user : name })

            let myDt = [];
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

                    result.data.data && result.data.data.map(v => {
                   
                        myDt.push({
                            id : v.file_icon,
                            name : v.file_name,
                            pre_date : moment(v.pre_date).format("DD-MM-YYYY") === '01-01-1900' ? '' : moment(v.pre_date).format("DD-MM-YYYY"),
                            pre_by : v.pre_by,
                            last_date : v.last_date === null ? '' : moment(v.last_date).format("DD-MM-YYYY"),
                            last_by : v.last_by,
                        })
                    })
    
                    this.setState({ data : myDt, docno: '', name : '' })
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
            
            let result = await Axios.post("http://10.32.1.169:5001/api/updatefile", { docno : this.state.docno, name : this.state.name, user : name })

            let myDt = [];
            if (result.data.length !== 0) 
            {

                result.data.data && result.data.data.map(v => {
                
                    myDt.push({
                        id : v.file_icon,
                        name : v.file_name,
                        pre_date : moment(v.pre_date).format("DD-MM-YYYY") === '01-01-1900' ? '' : moment(v.pre_date).format("DD-MM-YYYY"),
                        pre_by : v.pre_by,
                        last_date : v.last_date === null ? '' : moment(v.last_date).format("DD-MM-YYYY"),
                        last_by : v.last_by,
                    })
                })

                this.setState({ data : myDt, docno: '', name : '' })
            }
        }
    }

    myColumns() 
    {
        const columns = [
            {
                title: 'รหัสแฟ้ม',
                dataIndex: 'id',
                width: 40,
            }, {
                title: 'ชื่อแฟ้มระบบงาน',
                dataIndex: 'name',
            }, {
                title: 'วันที่บันทึก',
                dataIndex: 'pre_date',
                width: 120,
            }, {
                title: 'ผู้บันทึก',
                dataIndex: 'pre_by',
                width: 140,
            }, {
                title: 'วันที่แก้ไข',
                dataIndex: 'last_date',
                width: 120,
            }, {
                title: 'ผู้แก้ไข',
                dataIndex: 'last_by',
                width: 140,
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
                                    <Button color="success" onClick={this.handlerAddData}><BiPlusCircle /> เพิ่มข้อมูล</Button>
                                    :
                                    <Button color="warning" onClick={this.handlerEditData}><BiEditAlt /> แก้ไขข้อมูล</Button>
                                 } 
                                </Col>
                            </Row>
                        </FormGroup>
                    </Form>
                    <Row style={{ marginTop: 10 }}>
                        <Col>
                            <Table
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