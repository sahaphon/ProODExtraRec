import React, { Component } from 'react';
import 'antd/dist/antd.css';
import { Steps, Badge, Tabs, Input, Form, Select, Table } from 'antd';
import { CaretDownOutlined, CaretUpOutlined, CloseOutlined, CheckOutlined, DeleteOutlined, PrinterOutlined, BellOutlined } from '@ant-design/icons';
import {
  Card,
  CardHeader,
  CardBody,
  Col,
  Row,
  Button
} from "reactstrap";
import Axios from 'axios';
import BootstrapTable from 'react-bootstrap-table-next';
import moment from 'moment';
import Cookies from "js-cookie";
import Sweet from 'sweetalert2';
import paginationFactory from 'react-bootstrap-table2-paginator';
import { BiFolderOpen } from 'react-icons/bi';

const { TabPane } = Tabs;

class Recfirm extends Component
{
    state = {
        recfirm: [],
        data_waiting: [],
        data_signed:[],
        haveDt: '',
        docno: "",
        count_all:0,
        count_wait:0,
        count_singed:0,
        sign_pos: '',
        pfs_id: '',
    };

    //sign_pos คือ ตำแหน่งที่ user คนนั้นต้องเซ็นต์ 
    async componentDidMount()
    {
        const [name, pfs_id, pos] = Cookies.get("person").split("/")
        let result = await Axios.post("http://10.32.1.169:5001/api/getrec_doc", { pfs_id: pfs_id })

        if (result.data.length !== 0) 
        {
          const data = [];
          let i = 0;

          this.setState({ sign_pos: result.data.position, pfs_id: pfs_id }); //บันทึกตำแหน่งที่ต้องเซ็นต์

          let nSign = 0;
          result.data.data && result.data.data.map((v) => {

              if (i === 0)
              {
                this.setState({ haveDt: '1' })
              }

              for (var j=1; j <= 7 ; j++)
              {

                  if (j === 1 && v.pos1 === 'Finished')
                  {
                    nSign = 1
                  }
                  else if (j === 2)
                  {
                    if (v.pos2 === 'Finished')
                    {
                      nSign = 2
                    }
                  }
                  else if (j === 3)
                  {
                     if (v.pos3 === 'Finished')
                     {
                       nSign = 3
                     }
                  }
                  else if (j === 4)
                  {
                     if (v.pos4 === 'Finished')
                     {
                       nSign = 4
                     }
                  }
                  else if (j === 5)
                  {
                     if (v.pos5 === 'Finished')
                     {
                       nSign = 5
                     }
                  }
                  else if (j === 6)
                  {
                     if (v.pos6 === 'Finished')
                     {
                       nSign = 6
                     }
                  }
                  else if (j === 7)
                  {
                     if (v.pos7 === 'Finished')
                     {
                       nSign = 7
                     }
                  }
              }

                data.push({
                  date: moment(v.date).format("DD-MM-YYYY"),
                  no: v.row_num,
                  docno: v.docno,
                  desc: 'เอกสารใบเปิด ORDER',
                  sign1: v.pos1_signed,
                  sign1_date: moment(v.pos1_date).format("DD-MM-YYYY") === '01-01-1900' ? '' : moment(v.pos1_date).format("DD-MM-YYYY"),
                  sign2: v.pos2_signed,
                  sign2_date: moment(v.pos2_date).format("DD-MM-YYYY") === '01-01-1900' ? '' : moment(v.pos2_date).format("DD-MM-YYYY"),
                  sign3: v.pos3_signed,
                  sign3_date: moment(v.pos3_date).format("DD-MM-YYYY") === '01-01-1900' ? '' : moment(v.pos3_date).format("DD-MM-YYYY"),
                  sign4: v.pos4_signed,
                  sign4_date: moment(v.pos4_date).format("DD-MM-YYYY") === '01-01-1900' ? '' : moment(v.pos4_date).format("DD-MM-YYYY"),
                  sign5: v.pos5_signed,
                  sign5_date: moment(v.pos5_date).format("DD-MM-YYYY") === '01-01-1900' ? '' : moment(v.pos5_date).format("DD-MM-YYYY"),
                  sign6: v.pos6_signed,
                  sign6_date: moment(v.pos6_date).format("DD-MM-YYYY") === '01-01-1900' ? '' : moment(v.pos6_date).format("DD-MM-YYYY"),
                  code: v.code,
                  name: v.custname,
                  sale: v.saleman,
                  prod: v.prodcode,
                  doctype: v.doctype,
                  time: moment.utc(v.date).format("HH:mm:ss"),
                  remark: v.remark,
                  progress: nSign + '/' + (v.p7 === '' ? 6 : 7),
                  pos2: v.pos2,
                  pos3: v.pos3,
                  pos4: v.pos4,
                  pos5: v.pos5,
                  pos6: v.pos6,
                  pos7: v.pos7,
                  totapprv: v.p7 === '' ? 6 : 7,
                  current_pos: nSign,
                })
        
                //<Progress width={25} type="circle" percent={v.progress} />
             i = i + 1
          })

          //เอกสารรอเซ็นตาม userlogin
          const data_p = [];
          var j = 0;

          result.data.data_person && result.data.data_person.map((v, index) => {

                j =j + 1

                data_p.push({
                   key: index,
                   date: moment(v.date).format("DD-MM-YYYY"),
                   time: moment.utc(v.date).format("HH:mm:ss"),
                   docno: v.docno,
                   type: v.doctype,
                   cname: v.custname,
                   sname: v.sname, 
                })
          })

          //เอกสารเซ็นต์แล้ว
          const data_ap = [];
          var k = 0;

          result.data.data_approved && result.data.data_approved.map((v, index) => {
            
             k = k + 1

             data_ap.push({
                key: index,
                date: moment(v.date).format("DD-MM-YYYY"),
                time: moment.utc(v.date).format("HH:mm:ss"),
                docno: v.docno,
                type: v.title,
                cname: v.custname,
                sname: v.saleman + ' ' + v.sname, 
             })
          })

          this.setState({ recfirm: data, count_all: i, data_waiting: data_p, count_wait: j, data_signed: data_ap, count_singed: k });
        }
        else
        {
          console.log("Not found data..")
        }
    }

  callback = key => 
  {
    // console.log(" คลิก Tab ==> ", key)
    if (key === '2')
    {
        this.GetDoc()
    }
    else if (key === '3')
    {
        this.GetApprovedDoc()
    }
  }

  async GetApprovedDoc()
  {
    const [name, pfs_id, pos] = Cookies.get("person").split("/")
    let result = await Axios.post("http://10.32.1.169:5001/api/doc_approved", {pfs_id: pfs_id})  

    if (result.data.length !== 0)  
     {
        const data = [];
        var i = 0;
        
        result.data.data && result.data.data.map((v, index) => {
            i = i + 1

            data.push({
               key: index,
               date: moment(v.date).format("DD-MM-YYYY"),
               time: moment.utc(v.date).format("HH:mm:ss"),
               docno: v.docno,
               type: v.title,
               cname: v.custname,
               sname: v.saleman + ' ' + v.sname, 
            })
        })

        this.setState({ data_signed: data, count_singed: i })
     }
  }

 DelDocument = async () =>
  {

     if (this.state.docno !== '')
     {
        Sweet.fire({
          title: 'Approval Confirmation?',
          text: "คุณต้องการลบเอกสาร ใช่หรือไม่",
          icon: 'question',
          showCancelButton: true,
          confirmButtonColor: '#3085d6',
          cancelButtonColor: '#d33',
          confirmButtonText: 'Yes'
        }).then((result) => {
          if (result.isConfirmed) {
        
            Axios.post("http://10.32.1.169:5001/api/delete", { docno: this.state.docno }).then(res => {

              console.log(res.data.succ)
              if (res.data.success === true)
              {
                  Sweet.fire(
                    'Deleted!',
                    'Your file has been deleted.',
                    'success'
                  )

                  this.GetDoc()  //Reload data 
              }
              else
              {
                console.log("Not Ok.", res.data.error)
                Sweet.fire(
                  'Error!',
                  'เกิดข้อผิดพลาด : ' + res.data.error + ' กรุณาลองใหม่อึกครั้ง!',
                  'error'
                )
              }

            }) 
          }
        })
     } 
     else
     {
        Sweet.fire({
          icon: 'error',
          title: 'ผิดพลาด',
          text: 'โปรดเลือกรายการด้วย!',
        })
     }
  }

  SignApprove = (e) => {
    
     if (this.state.docno !== '')
     {
        Sweet.fire({
              title: 'Approval Confirmation?',
              text: "คุณต้องการอนุมัติเอกสาร ใช่หรือไม่",
              icon: 'question',
              showCancelButton: true,
              confirmButtonColor: '#3085d6',
              cancelButtonColor: '#d33',
              confirmButtonText: 'Yes'
            }).then((result) => {
              if (result.isConfirmed) {
            
                Axios.post("http://10.32.1.169:5001/api/signed", {position: this.state.sign_pos, pfs_id: this.state.pfs_id, docno: this.state.docno }).then(res => {

                  console.log(res.data.succ)
                  if (res.data.succ === true)
                  {
                      Sweet.fire(
                        'Approved!',
                        'Your file has been approved.',
                        'success'
                      )

                      this.GetDoc()  //Reload data 
                  }
                  else
                  {
                    console.log("Not Ok.", res.data.msg)
                    Sweet.fire(
                      'Error!',
                      'เกิดข้อผิดพลาด : ' + res.data.msg + ' กรุณาลองใหม่อึกครั้ง!',
                      'error'
                    )
                  }

                }) 
              }
            })
     }
     else
     {
       Sweet.fire({
        icon: 'error',
        title: 'ผิดพลาด',
        text: 'โปรดคลิกเลือกรายการก่อน!'
      })
     }
  }

  GetActionFormat = (cell, row) => {

    return (
        <div>
           <Button color="primary" onClick={ () => this.props.history.push("/main/report/" + row.docno) }> พิมพ์</Button> 
        </div>
    );
}

  DontSignApprove()
  {
    Sweet.fire({
      title: 'Approval Confirmation?',
      text: "คุณต้องการอนุมัติเอกสาร ใช่หรือไม่",
      icon: 'question',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Yes'
    }).then((result) => {

      if (result.isConfirmed) {
        Sweet.fire(
          'Approved!',
          'Your file has been approved.',
          'success'
        )
      }
    })
  }

  async GetDoc ()
  {
      const [name, pfs_id, pos] = Cookies.get("person").split("/")
      let result = await Axios.post("http://10.32.1.169:5001/api/persondoc", {pfs_id: pfs_id})  

      if (result.data.length !== 0)  
       {
          const data = [];
          var i = 0;

          result.data.data && result.data.data.map((v, index) => {

              i = i + 1

              data.push({
                 key: index,
                 date: moment(v.date).format("DD-MM-YYYY"),
                 time: moment.utc(v.date).format("HH:mm:ss"),
                 docno: v.docno,
                 type: v.doctype,
                 cname: v.custname,
                 sname: v.sname, 
              })
          })

          this.setState({ data_waiting: data, count_wait: i })
       }
  }

  //เลือกเมนูค้นหา
  onSelectSearchMenu = e => {
    // console.log("select menu: ", e)
    this.setState({ value: e })
  }
  
    render() {

        const { Option } = Select;
        const { Search } = Input;
        const { Step } = Steps;

        //ตารางเอกสารเซ็นต์แล้ว
        const approved = [{
          title: 'Date',
          dataIndex: 'date',
        }, {
          title: 'Time',
          dataIndex: 'time',
        }, {
          title: 'Docno',
          dataIndex: 'docno',
        }, {
          title: 'ประเภทเอกสาร',
          dataIndex: 'type',
        }, {
          title: 'ร้านค้า',
          dataIndex: 'cname',
        }, {
          title: 'พนักงานขาย',
          dataIndex: 'sname',
        }];
       
        //ตารางเอกสารรอ Approve
        const waiting_approv = [{
          title: 'Date',
          dataIndex: 'date',
          width: '12%',
          render: (date, record) => (
            <p style={{ fontSize: '14px', color:'red', fontWeight:'bold', paddingTop:'13px' }}>
              {date}
            </p>
          )
        }, {
          title: 'Time',
          dataIndex: 'time',
        }, {
          title: 'Docno',
          dataIndex: 'docno',
          render: (docno, record) => (
            <p style={{ fontSize: '13px', color:'green', fontWeight:'bold', paddingTop:'13px' }}>
              {docno}
            </p>
          )
        }, {
          title: 'ประเภทเอกสาร',
          dataIndex: 'type',
          render: (type, record) => (
            <p style={{ fontSize: '13px', color:'blue', paddingTop:'12px' }}>
              {type}
            </p>
          )
        }, {
          title: 'ร้านค้า',
          dataIndex: 'cname',
        }, {
          title: 'พนักงานขาย',
          dataIndex: 'sname',
        }, {
          title: '',
          dataIndex: '',
          width: '10%',
          render: () => <Button color="success" onClick={this.SignApprove}><CheckOutlined /> อนุมัติ</Button>
        }, {
          title: '',
          dataIndex: '',
          width: '13%',
          render: () => <Button color="danger"><CloseOutlined /> ไม่อนุมัติ</Button>,
        }, this.state.pfs_id === '42494' ? 
        {
          title: '',
          dataIndex: '',
          width: '15%',
          render: () => 
            <Button color="primary"><BellOutlined /> ส่งต่อกรรมการ</Button>,
        }
        :
        {}  
      ];

        //ตารางหลัก
        const columns = [{
            dataField: 'no',
            text: 'No.',
            headerStyle: (colum, colIndex) => {
              return { textAlign: 'center' };
            }
          }, {
            dataField: 'progress',
            text: ''
          }, {
            dataField: 'date',
            text: 'Date',
            headerStyle: (colum, colIndex) => {
              return { width: '13%', textAlign: 'center' };
            }
          }, {
            dataField: 'time',
            text: 'Time',
            headerStyle: (colum, colIndex) => {
              return { width: '5%', textAlign: 'center' };
            }
          }, {
            dataField: 'doctype',
            text: 'ประเภทเอกสาร',
            headerStyle: (colum, colIndex) => {
              return { width: '20%', textAlign: 'center' }; //, color: '#FD0303'
            }
          }, {
            dataField: 'docno',
            text: 'Docno'
          }, {
            dataField: 'desc',
            text: 'Description',
            headerStyle: (colum, colIndex) => {
              return { width: '20%', textAlign: 'center' };
            }
          }, {
            dataField: 'prod',
            text: 'Prodcode',
            headerStyle: (colum, colIndex) => {
              return { width: '8%', textAlign: 'center' };
            }
          }, {
            dataField: 'code',
            text: 'CODE'
          }, {
            dataField: 'name',
            text: 'Name',
            headerStyle: (colum, colIndex) => {
              return { width: '40%', textAlign: 'center' };
            }
          }, {
            dataField: 'sale',
            text: 'Sale'
          }, {
            dataField: '',
            text: 'Action',
            formatter : this.GetActionFormat,
            events: {
              onClick: (e, column, columnIndex, row, rowIndex) => {
                e.stopPropagation();
              },
            },
            classes: "p-1"
          }];

       const expandRow = {

            renderer: row => (
              <div> 
                {this.state.recfirm.map( (v, index)=> {

                  if ( row.docno === v.docno)
                  {
                      return (
                        <Steps direction="horizontal" size="small" current={v.current_pos}> 
                          <Step title="Finished" description="ผู้รับออเดอร์" />
                          <Step title={v.pos2} description="ผจก.แผนกขาย" />
                          <Step title={v.pos3} description="ผจก.ฝ่ายขาย" />
                          <Step title={v.pos4} description="ผจก.แผนกผลิตภัณฑ์" />
                          <Step title={v.pos5} description="ผจก.ฝ่ายผลิตภัณฑ์" />
                          <Step title={v.pos6} description="ผจก.แผนกการเงิน" />
                        </Steps>
                        )
                  }
        
                })}
              </div>
            ),
            showExpandColumn: true,
            expandHeaderColumnRenderer: ({ isAnyExpands }) => {
              if (isAnyExpands) {
                return <b>-</b>;
              }
              return <b>+</b>;
            },
            expandColumnRenderer: ({ expanded }) => {
              if (expanded) {
                return (
                  <b><CaretUpOutlined /></b>
                );
              }
              return (
                 <b><CaretDownOutlined /></b>
              );
            }
          };

          //Defind table row font
          const rowStyle = (row, rowIndex) => {
            const style = {};

            style.fontSize = 12;
            return style;
          };

          // const rowEvents = {
          //   //เหตุการณ์คลิก Row
          //   onClick: (e, row, rowIndex) => {
          //     // console.log("Rows Index --->", rowIndex)
          //     _docno = row.docno;
          //   }
          // };

          //คลิกแถวที่เลือก
          const rowSelection = {
            onChange: (selectedRowKeys, selectedRows) => {
              console.log(`selectedRowKeys: ${selectedRowKeys}`, 'selectedRows: ', selectedRows);
            },
            onSelect: (record, selected, selectedRows) => {
              // console.log(record, selected, selectedRows);
              console.log("คลิก : ", record.docno, "selected: ", selected);
              if (selected && record.docno !== '') 
              {
                 this.setState({ docno: record.docno});
              }
              else{
                console.log("ไม่ได้เลือก..")
                this.setState({ id: '' });
              }
            },
            onSelectAll: (selected, selectedRows, changeRows) => {
              console.log("เลือกทั้งหมด")
              // console.log(selected, selectedRows, changeRows);
            },
          };

        return(
         
            <div className="animated fadeIn">
                <Row>
                    <Col xs={12}>
                       <Tabs defaultActiveKey="1" onChange={this.callback}>
                            <TabPane tab={<p>รายการทั้งหมด <Badge count={this.state.count_all} /></p>} key="1">
                                <Card>
                                  <CardHeader style={{ backgroundColor: 'rgb(194, 214, 214)', color:'blue' }}><BiFolderOpen style={{ color:'black' }}/> ใบเปิด ORDER</CardHeader>  
                                  <CardBody style={{ marginBottom: '140px' }}>
                                  { 
                                      this.state.haveDt === '1' ?
                                      <div>
                                        <Row>
                                            <Col>
                                                <Input.Group compact>
                                                  <Form.Item
                                                      name={['sale', 'code']}
                                                      noStyle
                                                      rules={[{ required: true, message: '' }]}
                                                    >
                                                    <Select placeholder="All Documents" onSelect={this.onSelectSearchMenu}>
                                                        <Option value="sale">รหัสเซล</Option>
                                                        <Option value="code">CODE</Option>
                                                    </Select>
                                                    <Search
                                                        placeholder="ระบุคำสืบค้น"
                                                        onSearch={value => console.log(value)}
                                                        style={{ width: 200 }}
                                                    />
                                                  </Form.Item>
                                                </Input.Group>    
                                            </Col>
                                            {/* <Col style={{ display: "flex", justifyContent: "flex-end" }}>
                                                <Button style={{ marginLeft: 3 }} color="info">พิมพ์</Button>
                                            </Col>              */}
                                        </Row>
                                        <Row style={{ marginTop: 10 }}>
                                            <Col>
                                                <BootstrapTable
                                                    keyField='no'
                                                    data={ this.state.recfirm }
                                                    columns={ columns }
                                                    expandRow={ expandRow }
                                                    rowStyle={ rowStyle }
                                                    // rowEvents={ rowEvents }  เหตุการณ์คลิก Row
                                                    pagination={paginationFactory()}
                                                    hover
                                                />
                                          </Col>
                                        </Row>
                                    </div>
                                    :
                                    <div>
                                      <Row>
                                          <span>Not found data..</span>
                                      </Row>
                                    </div>
                                  }
                                  </CardBody>
                                </Card> 
                            </TabPane>
                            <TabPane tab={<p>รอเซ็นต์อนุมัติ <Badge count={this.state.count_wait} /></p>} key="2"> 
                               <Card>
                                  <CardHeader style={{ backgroundColor: 'rgb(194, 214, 214)' }}></CardHeader>  
                                  <CardBody >
                                  {
                                     this.state.haveDt === '1' ?
                                    <div>
                                      <Row>
                                        <Col>
                                            <Input.Group compact>
                                              <Form.Item
                                                name={['sale', 'code']}
                                                noStyle
                                                rules={[{ required: true, message: '' }]}
                                                >
                                                <Select placeholder="All Documents" onSelect={this.onSelectSearchMenu}>
                                                    <Option value="sale">รหัสเซล</Option>
                                                    <Option value="code">CODE</Option>
                                                </Select>
                                                <Search
                                                    placeholder="ระบุคำสืบค้น"
                                                    onSearch={value => console.log(value)}
                                                    style={{ width: 200 }}
                                                />
                                              </Form.Item>
                                            </Input.Group>    
                                        </Col>
                                        <Col style={{ display: "flex", justifyContent: "flex-end" }}>
                                            <Button color="warning" onClick={()=> this.state.docno !== '' ? this.props.history.push("/main/edit/" + this.state.docno) : 
                                              Sweet.fire({
                                                icon: 'error',
                                                title: 'ผิดพลาด',
                                                text: 'โปรดเลือกรายการเพื่อเเก้ไข!',
                                              })
                                           }>แก้ไข</Button>
                                            <Button style={{ marginLeft: 5 }} color="danger" onClick={ this.DelDocument }>ลบ</Button>
                                            <Button style={{ marginLeft: 5 }} color="info" onClick={()=> this.state.docno !== '' ? this.props.history.push("/main/report/" + this.state.docno) : 
                                              Sweet.fire({
                                                icon: 'error',
                                                title: 'ผิดพลาด',
                                                text: 'โปรดเลือกรายการก่อนพิมพ์!',
                                              })
                                          }><PrinterOutlined /> พิมพ์</Button>
                                        </Col>
                                      </Row>
                                      <Row style={{ marginTop: 10 }}>
                                        <Col>
                                            <Table
                                                columns={ waiting_approv }
                                                dataSource={ this.state.data_waiting }
                                                rowSelection={{ 
                                                  type: 'radio',
                                                  ...rowSelection
                                                 }}
                                            />
                                        </Col>
                                      </Row>
                                    </div>
                                    :
                                      <div>
                                          <Row>
                                              <span>Not found data..</span>
                                          </Row>
                                      </div>
                                  }
                                  </CardBody>
                                </Card> 
                            </TabPane> 
                            <TabPane tab={<p>เซ็นต์อนุมัติแล้ว <Badge className="site-badge-count-109" count={this.state.count_singed} style={{ backgroundColor: '#52c41a' }} /> </p>} key="3"> 
                            <Card>
                                  <CardHeader style={{ backgroundColor: 'rgb(194, 214, 214)' }}></CardHeader>  
                                  <CardBody >
                                  {
                                     this.state.haveDt === '1' ?
                                    <div>
                                      <Row>
                                        <Col>
                                            <Input.Group compact>
                                              <Form.Item
                                                name={['sale', 'code']}
                                                noStyle
                                                rules={[{ required: true, message: '' }]}
                                                >
                                                <Select placeholder="All Documents" onSelect={this.onSelectSearchMenu}>
                                                    <Option value="sale">รหัสเซล</Option>
                                                    <Option value="code">CODE</Option>
                                                </Select>
                                                <Search
                                                    placeholder="ระบุคำสืบค้น"
                                                    onSearch={value => console.log(value)}
                                                    style={{ width: 200 }}
                                                />
                                              </Form.Item>
                                            </Input.Group>    
                                        </Col>
                                        <Col style={{ display: "flex", justifyContent: "flex-end" }}>
                                            <Button style={{ marginLeft: 5 }} color="danger"><DeleteOutlined style={{ marginBottom: 3 }} /> ลบรายการ</Button>
                                            <Button style={{ marginLeft: 5 }} color="info" onClick={()=> this.state.docno !== '' ? this.props.history.push("/main/report/" + this.state.docno) : 
                                              Sweet.fire({
                                                icon: 'error',
                                                title: 'ผิดพลาด',
                                                text: 'โปรดเลือกรายการ ก่อนพิมพ์!',
                                              })
                                          }><PrinterOutlined /> พิมพ์</Button>
                                        </Col>
                                      </Row>
                                      <Row style={{ marginTop: 10 }}>
                                        <Col>
                                            <Table
                                                columns={ approved }
                                                dataSource={ this.state.data_signed }
                                                rowSelection= {{ 
                                                  type: 'radio',
                                                  ...rowSelection
                                                 }} 
                                            />
                                        </Col>
                                      </Row>
                                    </div>
                                    :
                                      <div>
                                          <Row>
                                              <span>Not found data..</span>
                                          </Row>
                                      </div>
                                  }
                                  </CardBody>
                                </Card> 
                            </TabPane>
                        </Tabs> 
                    </Col>
                </Row>
            </div>
        )
    }
}

export default Recfirm;