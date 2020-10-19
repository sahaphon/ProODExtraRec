import React, { Component } from 'react';
// import 'antd/dist/antd.css';
import { Steps, Badge, Tabs, Input, Form, Select, Table, Dropdown, Menu } from 'antd';
import { CaretDownOutlined, CaretUpOutlined, CloseOutlined, PrinterOutlined, BellOutlined } from '@ant-design/icons';
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
import { BiFolderOpen, BiCheckCircle, BiChevronDownSquare, BiEditAlt, BiPrinter, BiEraser,BiPaperPlane, BiDislike, BiDotsHorizontal } from 'react-icons/bi';

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
       this.ReloadAllData()
    }

  async ReloadAllData()
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
              showbtn: v.p7 === '' ? 1 : 0,
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
  }

  callback = key => 
  {
    // console.log(" คลิก Tab ==> ", key)
    if (key === '2')  //เอกสารรอเซ็นรายคน
    {
        this.GetDoc()
    }
    else if (key === '3') //เอกสารเซ็นแล้ว
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

 DelDocument = async (val) =>
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
        
            Axios.post("http://10.32.1.169:5001/api/delete", { docno: val }).then(res => {

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

  DropDownItem(value)
  {

    const menu = (
      <Menu onClick={(e) => this.handleMenuClick(e, value)}>
        <Menu.Item key="1" icon={<BiEditAlt />}>
          แก้ไข
        </Menu.Item>
        <Menu.Item key="2" icon={<BiEraser />}>
           ลบ
        </Menu.Item>
        <Menu.Item key="3" icon={<BiPrinter />}>
           พิมพ์
        </Menu.Item>
      </Menu>
    );

    return menu;
  }

  handleMenuClick = async (e, val) => {
    //  console.log("ปุ่ม :", e.key);
    //  console.log("เอกสาร :", val);

    const str = Cookies.get("authorization").split(":")
    let user = str[0];

     if (e.key === '1')  //แก้ไข
     {
        //เช็คสิทธิ์การแก้ไขข้อมูล
        let result = await Axios.post("http://10.32.1.169:5001/api/permission", {docno: 'F1', user: user, act : 'EDIT' })
        
        if (result.data.length !== 0)
        {
              if (result.data.data ===  true)
              {
                this.props.history.push("/main/edit/" + val)
              }
              else
              {
                  Sweet.fire(
                    'Access denied!',
                    'ขออภัยคุณไม่มีสิทธิ์ดำเนินการในส่วนนี้..',
                    'error'
                  )
              }
        }
     }
     else if (e.key === '2') //ลบ
     {
        let result = await Axios.post("http://10.32.1.169:5001/api/permission", {docno: 'F1', user: user, act : 'DEL' })
          
        if (result.data.length !== 0)
        {
              if (result.data.data ===  true)
              {
                 this.DelDocument(val) 
              }
              else
              {
                  Sweet.fire(
                    'Access denied!',
                    'ขออภัยคุณไม่มีสิทธิ์ดำเนินการในส่วนนี้..',
                    'error'
                  )
              }
        }         
     }
     else  //พิมพ์
     {
        let result = await Axios.post("http://10.32.1.169:5001/api/permission", {docno: 'F1', user: user, act : 'PRINT' })
            
        if (result.data.length !== 0)
        {
              if (result.data.data ===  true)
              {
                 this.props.history.push("/main/report/" + val)
              }
              else
              {
                  Sweet.fire(
                    'Access denied!',
                    'ขออภัยคุณไม่มีสิทธิ์ดำเนินการในส่วนนี้..',
                    'error'
                  )
              }
        }         

     }
  }


  SignApprove = (e) => {
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
            
                Axios.post("http://10.32.1.169:5001/api/signed", {position: this.state.sign_pos, pfs_id: this.state.pfs_id, docno: e }).then(res => {

                  if (res.data.succ === true)
                  {
                      Sweet.fire(
                        'Approved!',
                        'Your file has been approved.',
                        'success'
                      )

                      this.GetDoc()  //เอกสารรอเซ็นต์
                      this.GetApprovedDoc() //เอกสารเซ็นต์แล้ว
                  }
                  else
                  {
                    // console.log("Not Ok.", res.data.msg)
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


          //โหลดข้อมูลเอกสารทั้งหมด
          const data2 = [];
          let k = 0;

          let nSign = 0;
          result.data.data_main && result.data.data_main.map((v) => {
                 
              if (k === 0)
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

                data2.push({
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
                  showbtn: v.p7 === '' ? 1 : 0,
                  current_pos: nSign,
                })
  
             k = k + 1;
          })

          this.setState({ data_waiting: data, count_wait: i, recfirm: data2, count_all: k })
       }
  }

  referMgrDirect = async (e) => {
    
    let result = await Axios.post("http://10.32.1.169:5001/api/refermd", {docno: e})

    if (result.data.success)
    {
       this.ReloadAllData()
    }
    else
    {
      Sweet.fire(
        'ผิดพลาด!',
        'ERROR : ' + result.data.error + ' กรุณาลองใหม่อีกครั้ง!',
        'error'
      )
    }
  }

  //เลือกเมนูค้นหา
  onSelectSearchMenu = e => {
    console.log("select menu: ", e)
    this.setState({ value: e })
  }
  
    render() {

        const { Option } = Select;
        const { Search } = Input;
        const { Step } = Steps;

        //ตารางเอกสารเซ็นต์แล้ว
        const approved = [{
          title: 'Docno',
          dataIndex: 'docno',
          render(text, record) {
            return {
              props: {
                style: { textAlign : 'center'}
              },
              children: <div>{text}</div>
            };
          }
        }, {
          title: 'Date',
          dataIndex: 'date',
          render(text, record) {
            return {
              props: {
                style: { textAlign : 'center'}
              },
              children: <div>{text}</div>
            };
          }
        }, {
          title: 'Time',
          dataIndex: 'time',
          render(text, record) {
            return {
              props: {
                style: { textAlign : 'center'}
              },
              children: <div>{text}</div>
            };
          }
        }, {
          title: 'ประเภทเอกสาร',
          dataIndex: 'type',
        }, {
          title: 'ร้านค้า',
          dataIndex: 'cname',
        }, {
          title: 'พนักงานขาย',
          dataIndex: 'sname',
        }, {
          title: '',
          dataIndex: '',
          render: (record) => (
            <Button style={{ marginLeft: 5 }} color="info" onClick={()=> this.props.history.push("/main/report/" + record.docno) }><PrinterOutlined /> พิมพ์</Button>
          )
        }];
       
        //ตารางเอกสารรอ Approve
        const waiting_approv = [{
          title: 'Docno',
          dataIndex: 'docno',
          render: (docno, record) => (
            <p style={{ fontSize: '13px', color:'green', fontWeight:'bold', paddingTop:'13px', textAlign : 'center' }}>
              {docno}
            </p>
          )
        }, {
          title: 'Date',
          dataIndex: 'date',
          width: '10%',
          render: (date, record) => (
            <p style={{ fontSize: '14px', color:'red', fontWeight:'bold', paddingTop:'13px', textAlign : 'center' }}>
              {date}
            </p>
          )
        }, {
          title: 'Time',
          dataIndex: 'time',
          render(text, record) {
            return {
              props: {
                style: { textAlign : 'center'}
              },
              children: <div>{text}</div>
            };
          }
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
          titel: 'Action',
          dataIndex: '',
          width: '8%',
          render: (record) => (
            <div>
               <Dropdown overlay={() => this.DropDownItem(record.docno)}>
                  <Button>
                    เลือก <BiDotsHorizontal />
                  </Button>
              </Dropdown>
         </div>
          )
        }, {
          title: '',
          dataIndex: '',
          width: '10%',
          render: (record) => (
              <Button color="success" onClick={() => this.SignApprove(record.docno)}><BiCheckCircle /> อนุมัติ</Button>
          )   
        }, {
          title: '',
          dataIndex: '',
          width: '10%',
          render: () => <Button color="danger"><BiDislike /> ไม่อนุมัติ</Button>,
        }, this.state.pfs_id === '42494' ? {
          title: '',
          dataIndex: '',
          width: '15%',
          render: (record) => 

              this.state.recfirm.map(v => {
                    if (v.docno === record.docno) 
                    { 
                        if (v.showbtn === 1)
                        {
                          return  <Button color="primary" onClick={() => this.referMgrDirect(record.docno)}><BiPaperPlane /> ส่งต่อกรรมการ</Button>
                        }  
                    }
              })
        }
        :
        []
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
                e.stopPropagation(); //ไม่ให้ expand row
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

                     if (v.totapprv === 6)
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
                     else
                     {
                          return (
                              <Steps direction="horizontal" size="small" current={v.current_pos}> 
                                <Step title="Finished" description="ผู้รับออเดอร์" />
                                <Step title={v.pos2} description="ผจก.แผนกขาย" />
                                <Step title={v.pos3} description="ผจก.ฝ่ายขาย" />
                                <Step title={v.pos4} description="ผจก.แผนกผลิตภัณฑ์" />
                                <Step title={v.pos5} description="ผจก.ฝ่ายผลิตภัณฑ์" />
                                <Step title={v.pos7} description="รองกรรมการฯ" />
                                <Step title={v.pos6} description="ผจก.แผนกการเงิน" />
                              </Steps>
                            )
                     }
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
                                                        onSearch={value => console.log("ค้นหาโดย : ", value)}
                                                        style={{ width: 200 }}
                                                    />
                                                  </Form.Item>
                                                </Input.Group>    
                                            </Col>
                                        </Row>
                                        <Row style={{ marginTop: 10 }}>
                                            <Col>
                                                <BootstrapTable
                                                    keyField='no'
                                                    data={ this.state.recfirm }
                                                    columns={ columns }
                                                    expandRow={ expandRow }
                                                    rowStyle={ rowStyle }
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
                                  <CardHeader style={{ backgroundColor: 'rgb(194, 214, 214)', color:'blue' }}><BiFolderOpen style={{ color:'black' }}/> ใบเปิด ORDER</CardHeader> 
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
                                      </Row>
                                      <Row style={{ marginTop: 10 }}>
                                        <Col>
                                            <Table
                                                bordered
                                                columns={ waiting_approv }
                                                dataSource={ this.state.data_waiting }
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
                                  <CardHeader style={{ backgroundColor: 'rgb(194, 214, 214)', color:'blue' }}><BiFolderOpen style={{ color:'black' }}/> ใบเปิด ORDER</CardHeader> 
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
                                      </Row>
                                      <Row style={{ marginTop: 10 }}>
                                        <Col>
                                            <Table //className={tbstyle}
                                                bordered
                                                columns={ approved }
                                                dataSource={ this.state.data_signed }
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