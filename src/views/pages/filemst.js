import React, { Component }  from 'react'
import {Card, CardHeader, CardBody, Col, Row, Button, Form, Input, FormGroup, Label} from "reactstrap";
import { BiFolderOpen, BiTrash, BiEditAlt, BiPlusCircle } from 'react-icons/bi';
import { Table } from 'antd';
import Axios from 'axios';
import moment from 'moment';
import Cookies from "js-cookie";

class Filemst extends Component
{
   state = {
       data : [],
   }

  async componentDidMount()
  {
        const [name, pfs_id, pos] = Cookies.get("person").split("/")
        let result = await Axios.post("http://10.32.1.169:5001/api/files")

        if (result.data.length !== 0) 
        {
            let myDt = [];
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

            this.setState({ data : myDt });
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
            }, {
                title: 'Action',
                dataIndex: '',
                width: 280,
                render: (record) => (
                    <div>
                        <Button color="secondary" onClick={() => this.props.history.push("/main/filemst/edit/" + record.id + '~' + record.name )}><BiEditAlt /> แก้ไข</Button>
                        <Button color="danger" style={{ marginLeft: '6px'}}><BiTrash /> ลบ</Button>
                    </div>),
            }];

        return columns;
    }

     render () {

        //คลิกแถวที่เลือก
        //   const rowSelection = {
        //     onChange: (selectedRowKeys, selectedRows) => {
        //       console.log(`selectedRowKeys: ${selectedRowKeys}`, 'selectedRows: ', selectedRows);
        //     },
        //     onSelect: (record, selected, selectedRows) => {
        //       // console.log(record, selected, selectedRows);
        //       console.log("คลิก : ", record.id, "selected: ", selected);
        //       if (selected && record.docno !== '') 
        //       {
        //          this.setState({ docno: record.id});
        //       }
        //       else{
        //         console.log("ไม่ได้เลือก..")
        //         this.setState({ docno: '' });
        //       }
        //     },
        //     onSelectAll: (selected, selectedRows, changeRows) => {
        //       console.log("เลือกทั้งหมด")
        //       // console.log(selected, selectedRows, changeRows);
        //     },
        //   };

        return (
           <div>
              <Card>
                  <CardHeader style={{ backgroundColor: 'rgb(194, 214, 214)', color: 'blue' }}><BiFolderOpen style={{ color: 'black' }}/> ข้อมูลแฟ้มระบบงาน</CardHeader>  
                  <CardBody>
                    <Row>
                       <Col style={{ display: 'flex', justifyContent: 'flex-end'}}>
                          <Button color="success" style={{ marginLeft: '6px'}} onClick={()=> this.props.history.push("/main/filemst/add") }><BiPlusCircle /> เพิ่มรายการ</Button>
                       </Col>
                    </Row>
                    <Row style={{ marginTop: 10 }}>
                        <Col>
                            <Table
                                columns={ this.myColumns() }
                                dataSource={ this.state.data }
                                // rowSelection= {{ 
                                //     type: 'radio',
                                //     ...rowSelection
                                //     }} 
                            />
                        </Col>
                    </Row>
                  </CardBody>
              </Card>
           </div>
        )
     }
}

export default Filemst;