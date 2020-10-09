import React, { Component } from 'react';
import 'antd/dist/antd.css';
import { Table, Tooltip, Modal } from 'antd';
import { EditTwoTone, EditFilled,  FileImageTwoTone, CloseOutlined, CheckCircleTwoTone, CloseCircleTwoTone } from '@ant-design/icons';
import Moment from 'moment';
import { Button } from 'reactstrap';
import Swal from 'sweetalert2';
import ReactToPrint from 'react-to-print';
import {
  Card,
  CardHeader,
  CardBody,
  Col,
  Row,
} from "reactstrap";
import Axios from 'axios';

class Verify extends Component {

  state = {
    columns: [],
    data: [],
    image: '',
    img_title: '',
    sortedInfo: null,
    type: '',
    regno: null,
    customerID: null,
    prefix: null,
    name: null,
    lastname: null,
    phone: null,
    email: null,
    idcard: null,
    birthday: null,
    company: null,
    address1: null,
    tumbol: null,
    amphur: null,
    province: null,
    country: null,
    zipcode: null,
    predate: null,
  }

   async loadProfileData()
   {

     const result = await Axios.post('http://10.32.0.86:81/onlinewholesale_backend/api/profile', { customerID: this.state.customerID }).then(res => {

     this.setState({
      regno: res.data.data[0].docno,
      // prefix: res.data.data[0].prefix,
      name: res.data.data[0].name,
      lastname: res.data.data[0].lastname,
      phone: res.data.data[0].phone,
      email: res.data.data[0].email,
      idcard: res.data.data[0].idcard,
      birthday: res.data.data[0].birthday,
      company: res.data.data[0].company,
      address1: res.data.data[0].address1,
      tumbol: res.data.data[0].tumbol,
      amphur: res.data.data[0].amphur,
      province: res.data.data[0].province,
      country: res.data.data[0].country,
      zipcode: res.data.data[0].zipcode,
      predate: res.data.data[0].date,
     })

     }).catch(error => {
      Swal.fire(
        'Error',
        'เกิดข้อผิดพลาดกรุณาลองใหม่อีกครั้ง! :' + error,
        'error'
      )
    })
   }

   async not_approved(val, custno, d1, d2, d3, d4, remark, email, name) 
   {
    let appv1 = '' 
    let appv2 = ''
    let appv3 = ''
    let appv4 = ''

     d1 !== '' ? appv1 = 0 : appv1 = 0;
     d2 !== '' ? appv2 = 0 : appv2 = 0;
     d3 !== '' ? appv3 = 0 : appv3 = 0;
     d4 !== '' ? appv4 = 0 : appv4 = 0;

    let result2 = await Axios.post('http://10.32.0.86:81/onlinewholesale_backend/api/not_approve', { user: 'ADMIN', docno: val, customerID: custno,
  appv1: appv1, appv2: appv2, appv3: appv3, appv4: appv4, remark });

    if (result2.data.success === true) {

      let data2 = [];
      result2.data.data && result2.data.data.map((value, idx) => {

        data2.push({
          key: idx,
          docno: value.docno,
          customerID: value.customerID,
          date: Moment(value.date).format("DD-MM-YYYY"),
          prefix: value.prefix,
          fullname: value.fullname,
          sex: value.sex,
          address: value.adds,
          phone: value.phone,
          doc1: value.doc1,
          doc2: value.doc2,
          doc3: value.doc3,
          doc4: value.doc4,
        })
      })

      this.setState({ data: data2 });

      //Send mail
      let result3 = await Axios.post('http://10.32.0.86:81/onlinewholesale_backend/api/sendmail', { receiver: email, subject: 'แจ้งผลการสมัครสมาชิก', body: 
      '<p>เรียน คุณ' + name + '</p></br><p><dd>การสมัครสมาชิกของท่าน "ไม่ผ่านการอนุมัติ" เนื่องจากข้อมูลหรือเอกสารประกอบการสมัครไม่สมบรูณ์หรือถูกต้อง หากมีข้อสงสัยกรุณาติดต่อโดยตรงได้ที่เบอร์ที่ให้ไว้ข้างล่างนี้</dd></p></br><p style="color:blue">ขอแสดงความนับถือ<br>บริษัท แอ็ดด้า ฟุตแวร์(ไทยเเลนด์) จำกัด<br>โทรศัพฑ์: 0-2416-0026 ต่อ 284<br>e-mail: support@adda.co.th<p>' });
  
      if (result3.data.success === true) 
      {
          console.log("send ..")
      }
      else
      {
          console.log("not send..")
      }
  
 
      Swal.fire(
        'เรียบร้อย!',
        'คุณได้ยืนยันผลการตรวจสอบ "ไม่ผ่านการสมัคร" เรียบร้อยแล้ว',
        'success'
      )
    }
    else
    {

      Swal.fire(
        'Error',
        'เกิดข้อผิดพลาดกรุณาลองใหม่อีกครั้ง! :' + result2.data.msg,
        'error'
      )
    }
   }

   async approved_acc(val, custno, d1, d2, d3, d4, email, name) 
   {
    let appv1 = '' 
    let appv2 = ''
    let appv3 = ''
    let appv4 = ''

     d1 !== '' ? appv1 = 1 : appv1 = 0;
     d2 !== '' ? appv2 = 1 : appv2 = 0;
     d3 !== '' ? appv3 = 1 : appv3 = 0;
     d4 !== '' ? appv4 = 1 : appv4 = 0;

   
    let result2 = await Axios.post('http://10.32.0.86:81/onlinewholesale_backend/api/approve', { user: 'ADMIN', docno: val, customerID: custno,
  appv1: appv1, appv2: appv2, appv3: appv3, appv4: appv4 });

    if (result2.data.success === true) {
     
      let data2 = [];
      result2.data.data && result2.data.data.map((value, idx) => {

        data2.push({
          key: idx,
          docno: value.docno,
          customerID: value.customerID,
          date: Moment(value.date).format("DD-MM-YYYY"),
          fullname: value.fullname,
          sex: value.sex,
          address: value.adds,
          phone: value.phone,
          doc1: value.doc1,
          doc2: value.doc2,
          doc3: value.doc3,
          doc4: value.doc4,
        })
      })

      this.setState({ data: data2 });

      //Send mail
      let result3 = await Axios.post('http://10.32.0.86:81/onlinewholesale_backend/api/sendmail', { receiver: email, subject: 'แจ้งผลการสมัครสมาชิก', body: 
    '<p>เรียน คุณ' + name + '</p></br><p><dd>การสมัครสมาชิกของท่าน "ผ่านการอนุมัติ" สามารถใช้งาน Username ที่ท่านลงทะเบียนไว้เข้าใช้งานได้ที่ www.adda.co.th/onlinewholesale</dd></p></br><p style="color:blue">ขอแสดงความนับถือ<br>บริษัท แอ็ดด้า ฟุตแวร์(ไทยเเลนด์) จำกัด<br>โทรศัพฑ์: 0-2416-0026 ต่อ 284<br>e-mail: support@adda.co.th</p>' });
 
    if (result3.data.success === true) 
    {
        console.log("send ..")
    }
    else
    {
        console.log("not send..")
    }

      Swal.fire(
        'Approved!',
        'คุณได้อนุมัติการสมัครสมาชิกเรียบร้อยแล้ว',
        'success'
      )
    }
    else
    {

      Swal.fire(
        'Error',
        'เกิดข้อผิดพลาดกรุณาลองใหม่อีกครั้ง! :' + result2.data.msg,
        'error'
      )
    }
  }

  showModal = (value, value2) => {

    if (value2 === 'ข้อมูลทั่วไป')
    {
      this.setState({ type: '1', customerID: value})
    }
    else
    {
      this.setState({ type: '0'})
    }
  
    this.setState({
      visible: true,
      image: value,
      img_title: value2,
    });
  };

  handleOk = e => {

    window.print()  //send to printer

    this.setState({
      visible: false,
    });

  };

  handleCancel = e => {

    this.setState({
      visible: false,
    });
  };

  onChange = (pagination, filters, sorter, extra) => {
    console.log('params', pagination, filters, sorter, extra);

    this.setState({
      sortedInfo: sorter,
    })
  }

  async componentDidMount() {

    this.setState({
      columns: [
        {
          title: 'RegID',
          dataIndex: 'docno',
          width: '120px',
        },
        {
          title: 'Date',
          dataIndex: 'date',
          width: '120px',
          defaultSortOrder: 'descend',
          sorter: (a, b) => new Date(a.date) - new Date(b.date),
          ellipsis: true,
        },
        {
          title: 'Name',
          dataIndex: 'fullname',
          width: '160px',
          sorter: (a, b) => a.fullname.length - b.fullname.length,
          ellipsis: true,
        },
        {
          title: 'Sex',
          dataIndex: 'sex',
        },
        {
          title: 'Address',
          dataIndex: 'address',
          width: '340px',
        },
        {
          title: 'Phone',
          dataIndex: 'phone',
          width: '120px',
        },
        {
          title: 'Email',
          dataIndex: 'email',
          width: '280px',
        },
        {
          title: 'ข้อมูลทั่วไป',
          dataIndex: '',
          render: (_, record) => record.doc1 !== '' ?
            <Tooltip title="แสดงรายละเอียด"><a onClick={()=> this.showModal(record.customerID, "ข้อมูลทั่วไป")}><FileImageTwoTone /></a></Tooltip> : null
        },
        {
          title: 'สำเนาบัตร ปชช.',
          dataIndex: 'doc1',
          render: (_, record) => record.doc1 !== '' ?
            <Tooltip title="แสดงรายละเอียด"><a onClick={()=> this.showModal(record.doc1, "สำเนาบัตร ปชช.")}><FileImageTwoTone /></a></Tooltip> : null
        },
        {
          title: 'สำเนาทะเบียนบ้าน',
          dataIndex: 'doc2',
          render: (_, record) => record.doc2 !== '' ? <Tooltip title="แสดงรายละเอียด"><a onClick={()=>this.showModal(record.doc2, "สำเนาทะเบียนบ้าน")}><FileImageTwoTone /> </a></Tooltip> : null
        },
        {
          title: 'เอกสารจดทะเบียนพาณิชย์',
          dataIndex: 'doc3',
          render: (_, record) => record.doc3 !== '' ? <Tooltip title="แสดงรายละเอียด"><a onClick={()=>this.showModal(record.doc3, "เอกสารจดทะเบียนพาณิชย์")}><FileImageTwoTone /></a></Tooltip> : null
        },
        {
          title: 'รูปถ่ายหน้าร้าน',
          dataIndex: 'doc4',
          render: (_, record) => record.doc4 !== '' ? <Tooltip title="แสดงรายละเอียด"><a onClick={()=>this.showModal(record.doc4, "รูปถ่ายหน้าร้าน")}><FileImageTwoTone /></a></Tooltip> : null
        },
        {
          title: 'อนุมัติ',
          render: (_, record) => <a onClick={()=>
            Swal.fire({
              title: 'Approve account?',
              text: "ยืนยันอนุมัติการสมัครสมาชิก!",
              icon: 'question',
              showCancelButton: true,
              confirmButtonColor: '#3085d6',
              cancelButtonColor: '#d33',
              cancelButtonText: 'ยกเลิก',
              confirmButtonText: 'ตกลง'
            }).then((result) => {

              if (result.value === true) {             
                this.approved_acc(record.docno, record.customerID, record.doc1, record.doc2, record.doc3, record.doc4, record.email, record.fullname)
              }
            })
          }><EditFilled /></a>
        },
        {
          title: 'ไม่อนุมัติ',
          render: (_, record) => <a onClick={()=> 

            Swal.fire({
              title: 'Not approve account!',
              text: "ไม่อนุมัติการสมัคร ใช่หรือไม่?",
              icon: 'error',
              showCancelButton: true,
              confirmButtonColor: '#3085d6',
              cancelButtonColor: '#d33',
              cancelButtonText: 'ไม่ใช่',
              confirmButtonText: 'ใช่'
            }).then((result) => {

              if (result.value === true) 
              {       
                Swal.fire({
                  title: 'โปรดระบุเหตุผล',
                  input: 'text',
                  inputAttributes: {
                    autocapitalize: 'off'
                  },
                  showCancelButton: true,
                  confirmButtonText: 'บันทึก',
                  cancelButtonText: 'ปิด',
                  showLoaderOnConfirm: true,
                  preConfirm: (txt) => {
    
                     this.not_approved(record.docno, record.customerID, record.doc1, record.doc2, record.doc3, record.doc4, txt, record.email, record.fullname)
                  },
              
                }).then((result) => {
                  if (result.value) {
                    Swal.fire({
                      title: `${result.value.login}'s avatar`,
                      imageUrl: result.value.avatar_url
                    })
                  }
                })      
                //this.approved_acc(record.docno, record.customerID, record.doc1, record.doc2, record.doc3, record.doc4)
              }
              else {
                    console.log("ไม่กดปุ่มใดๆ...")
              }
            })
          }><CloseOutlined /></a>
        },
      ]
    })

    let result = await Axios.post('http://10.32.0.86:81/onlinewholesale_backend/api/verify');

    if (result.data.length !== 0) {

      let data2 = [];
      result.data.data && result.data.data.map((value, idx) => {
       
        data2.push({
          key: idx,
          docno: value.docno,
          customerID: value.customerID,
          date: Moment(value.date).format("L"),
          sex: value.sex,
          fullname: value.fullname,
          address: value.adds,
          phone: value.phone,
          email: value.email,
          doc1: value.doc1,
          doc2: value.doc2,
          doc3: value.doc3,
          doc4: value.doc4,
        })
      })

      this.setState({ data: data2 });
    }
    else {

      Swal.fire({
        icon: 'error',
        title: 'Empty data.',
        text: 'ไม่พบข้อมูล โปรดลองใหม่อีกครั้ง!..'
      })
    }
  }

  render() {

    let { sortedInfo } = this.state;
    sortedInfo = sortedInfo || {};

    return (
      <div className="animated fadeIn">
        {
          this.state.type === '1'? this.pdfPrint() : this.showDocument()
        }
        <Row>
          <Col xs={12}>
            <Card>
              <CardHeader>ข้อมูลรอตรวจสอบ</CardHeader>
              <CardBody>
                <Table columns={this.state.columns}
                  dataSource={this.state.data}
                  onChange={this.onChange}
                />
              </CardBody>
            </Card>
          </Col>
        </Row>
      </div>
    )
  }

  pdfPrint() //ข้อมูลทั่วไป
  {
   this.loadProfileData()

    return (
      <div>
            <Modal
                centered
                visible={this.state.visible}
                onOk={this.handleOk}
                onCancel={this.handleCancel}

                footer={[
                  <Button key="back" color="danger" onClick={this.handleCancel}>
                    ปิด
                  </Button>,
                  <Button key="submit" color="success" onClick={this.handleOk}>
                    พิมพ์
                  </Button>,
                ]}
            >
                <Row>
                  <Col xs='12'>
                      <h5 style={{ textAlign:"center" }}>ข้อมูลการสมัคร</h5>
                  </Col>
                </Row>
                <Row>
                  <Col xs='3' style={{ textAlign: 'right'}}>
                    <p>RegNo. :</p>
                  </Col>
                  <Col xs='3' style={{ textAlign: 'left'}}>
                    {this.state.regno}
                  </Col>
                  <Col xs='3' style={{ textAlign: 'center'}}>
                     <p>วันที่สมัคร :</p>
                  </Col>
                  <Col xs='3' style={{ textAlign: 'left'}}>
                     {Moment(this.state.predate).format("DD/MM/YYYY")}
                  </Col>
                </Row>
                <Row>
                   <Col xs='3' style={{ textAlign: 'right'}}>
                      <p>ชื่อ-สกุล :</p>
                    </Col>
                    <Col xs='9' style={{ textAlign: 'left'}}>
                      {this.state.prefix + ' ' + this.state.name + ' ' + this.state.lastname}
                    </Col>
                </Row>
                <Row>
                    <Col xs='3' style={{ textAlign: 'right'}}>
                      <p>บริษัท/ร้านค้า :</p>
                    </Col>
                    <Col xs='9' style={{ textAlign: 'left'}}>
                      {this.state.company}
                    </Col>
                </Row>
                <Row>
                   <Col xs='3' style={{ textAlign: 'right'}}>
                      <p>ที่อยู่ :</p>
                    </Col>
                    <Col xs='9' style={{ textAlign: 'left'}}>
                      {this.state.address1}
                    </Col>
                </Row>
                <Row>
                   <Col xs='3' style={{ textAlign: 'right'}}>
                      <p>แขวง/ตำบล :</p>
                    </Col>
                    <Col xs='3' style={{ textAlign: 'left'}}>
                      {this.state.tumbol}
                    </Col>
                    <Col xs='3' style={{ textAlign: 'right'}}>
                      <p>เขต/อำเภอ :</p>
                    </Col>
                    <Col xs='3' style={{ textAlign: 'left'}}>
                      {this.state.amphur}
                    </Col>
                </Row>
                <Row>
                   <Col xs='3' style={{ textAlign: 'right'}}>
                      <p>จังหวัด :</p>
                    </Col>
                    <Col xs='3' style={{ textAlign: 'left'}}>
                      {this.state.province}
                    </Col>
                    <Col xs='3' style={{ textAlign: 'right'}}>
                      <p>รหัสไปรษณีย์ :</p>
                    </Col>
                    <Col xs='3' style={{ textAlign: 'left'}}>
                      {this.state.zipcode}
                    </Col>
                </Row>
                <Row>
                   <Col xs='3' style={{ textAlign: 'right'}}>
                      <p>มือถือ :</p>
                    </Col>
                    <Col xs='9' style={{ textAlign: 'left'}}>
                      {this.state.phone + ' E-mail : ' + this.state.email}
                    </Col>
                </Row>
            </Modal>
      </div>
    )
  }

  showDocument() //บัตร ปชช., ทะเบียนบ้าน, ...
  {
    
    return (
      <div>
            <Modal
                title= {this.state.img_title}
                centered
                visible={this.state.visible}
                onOk={this.handleOk}
                onCancel={this.handleCancel}

                footer={[
                  <Button key="back" color="danger" onClick={this.handleCancel}>
                    ปิด
                  </Button>,
                  <Button key="submit" color="success" onClick={this.handleOk}>
                    พิมพ์
                  </Button>,
                ]}
            >
                <img style={{ width:400, height:400 }} src={"http://10.32.0.14:83/" + this.state.image}></img>
            </Modal>
      </div>
    )
  }

}

export default Verify;