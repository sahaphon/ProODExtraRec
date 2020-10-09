import React, { Component } from 'react';
import 'antd/dist/antd.css';
import { Checkbox, Space, DatePicker, Layout } from 'antd';
import { EditOutlined } from '@ant-design/icons';
import {
  Card,
  CardHeader,
  CardBody,
  Col,
  Row,
  Button,
  Form,
  Input,
  FormGroup, Label,
} from "reactstrap";
import Axios from 'axios';
import moment from 'moment';
import BootstrapTable from 'react-bootstrap-table-next';
import cellEditFactory from 'react-bootstrap-table2-editor';
import Cookies from "js-cookie";
import Sweet from 'sweetalert2';
import numeral from 'numeral';

const dateFormat = 'DD-MM-YYYY';
let _docno = '';
let _pfsid = '';

class AeRecfirm extends Component
 {
   //[2,3,4,5,6] คือ Array
   //{1,2,3,4,5} คือ Object
   //array of objects
   //ถ้้า setState หลายครั้ง จะ render หลายครั้งตามไปด้วย

    state = {
        head: [],
        detail: [],
        checkedList:[], //Default value
        docdate: moment().format("DD-MM-YYYY"),
        snddate: moment().format("DD-MM-YYYY"),
    }
 
    onChangeChkBox=(checkedValues)=>{

        // console.log("CheckList : ", checkedValues);
        this.setState({
            checkedList: checkedValues,
        });
    }

    onChangeCrChkBox=(e)=>{

        console.log(`checked = ${e.target.checked}`);

        // this.setState({
        //     checkedList: checkedValues,
        // });
    }

    handleChange=(e, index) => {
        // console.log('--> ', e.target.value)
        // console.log('--> ', e.target.name);

        var myState = Object.assign({}, this.state);

        if (e.target.name === 'odno')
        {
            myState.head[0].odno = e.target.value;
        }
        else if (e.target.name === 'area')
        {
            myState.head[0].area = e.target.value;
        }
        else if (e.target.name === 'pkno')
        {
            myState.head[0].pkno = e.target.value;
        }
        else if (e.target.name === 'country')
        {
            myState.head[0].country = e.target.value;
        }
        else if (e.target.name === 'disc')
        {
            myState.head[0].disc = e.target.value;
        }
        else if (e.target.name === 'deposit')
        {
            myState.head[0].deposit = e.target.value;
        }
        else if (e.target.name === 'remark')
        {
            myState.head[0].remark = e.target.value;
        }

        this.setState(myState);
    }

    // handleDocdateChange = date => {
    //     this.setState({
    //       docdate: date
    //     });
    //   };

    //   handleSndDateChange = date => {
    //     //handleSndDateChange
    //     this.setState({
    //       snddate: date
    //     });
    //   };

    async handleDelBtn(val)
    {
        const [name, pfs_id, pos] = Cookies.get("person").split("/")
        _pfsid = pfs_id;

        let result = await Axios.post("http://10.32.1.169:5001/api/edit", { no: val, pfs_id: _pfsid })  

        if (result.data.success)
        {

            let dt = [];

                //Transection
                result.data.data && result.data.data.map((v, index) => {

                    dt.push({
                        id: v.no,
                        prodcode: v.prodcode,
                        color: v.desc,
                        size: v.size,
                        qty: v.qty,
                        price: v.price,
                        amt: (parseInt(v.qty) *  v.price),
                        remark: v.remark,
                    })
                 })

             this.setState({ detail: dt });
        }
        else
        {
            console.log("Can't not delete row.", result.data.error);
        }
    }

    handleDocCancel=()=>
    {
        const [name, pfs_id, pos] = Cookies.get("person").split("/")
        Axios.post("http://10.32.1.169:5001/api/revoke", { pfs_id : pfs_id })   //ยิง Api เพื่อลบตารางทิ้ง 

        this.props.history.push('/main/documents');    //Back to page
    }

    handleSaveBtn = async () => {

        //ส่ง state ได้ผ่าน arrow function only
        const [name, pfs_id, pos] = Cookies.get("person").split("/")
        let result = await Axios.post("http://10.32.1.169:5001/api/update", { docno: _docno, pfs_id: pfs_id, header: this.state.head }) 
        
        if (result.data.success)
        {
            Sweet.fire(
                'Greate!',
                'Your data has been successfully saved.',
                'success'
              )
        }
        else
        {
            Sweet.fire(
                'Failed!',
                'Your data not saved. Please try again.',
                'error'
              )
        }
        
        //push back
        this.props.history.push('/main/documents');   
      }

    // Define หัวคอลัมน์ตาราง
    getcolumnlist() {

        const columns = [
          {
            dataField: 'id',
            text: 'No.',
            editable: false,
            headerStyle: (colum, colIndex) => {
                return { width: '20px', textAlign: 'center' };
              }
          }, {
            dataField: 'color',
            text: 'สี',
            formatter: cell => <span>
                      <p style={{ display:'flex', justifyContent:'space-between', paddingLeft: '40px', marginBottom:'-50px' }}>{cell} <EditOutlined /></p>
                   </span>
          }, {
            dataField: 'size',
            text: 'Size',
            editorStyle: {
                backgroundColor: '#f0f5f5',
                maxWidth: '50%',
              },
              formatter: cell => <span>
              <p style={{ display:'flex', justifyContent:'space-between', paddingLeft: '40px', marginBottom:'-50px' }}>{cell} <EditOutlined /></p>
           </span>
          }, {
            dataField: 'qty',
            text: 'จำนวนคู่',
            footer: columnData => "Total :" + numeral(columnData.reduce((acc, item) => acc + item, 0)).format('0,0'),
            footerAlign: "right",
            footerAttrs: { colSpan: 4 },
            footerClasses: "text-danger",
            formatter: cell => <span>
                <p style={{ display:'flex', justifyContent:'space-between', marginBottom:'-50px' } }>{cell} <EditOutlined /></p>
        </span>, 
            editorStyle: {
                backgroundColor: '#f0f5f5',
                maxWidth: '50%',
              }
          }, {
            dataField: 'price',
            text: 'ราคา',
            formatter: cell => <span>
                <p style={{ display:'flex', justifyContent:'space-between',  marginBottom:'-50px' }}>{cell} <EditOutlined /></p>
        </span>, 
          }, {
            dataField: 'remark',
            text: 'หมายเหตุ',
            formatter: cell => <span>
                <p style={{ display:'flex', justifyContent:'space-between', marginBottom:'-50px' }}>{cell} <EditOutlined /></p>
        </span>, 
            editorStyle: {
                backgroundColor: '#f0f5f5',
                maxWidth: '50%',
              }
          }, {
            dataField: "number",
            text: 'Action',
            editable: false,
            formatter:  (cell, row, rowIndex) => <span>
                    <div style={{ display:'flex', justifyContent: 'center' }}> 
                        <Button color="danger" onClick={() => {
                            this.handleDelBtn(row.id)
                        }} >ลบ</Button>
                    </div>
              </span>,
            classes: "p-1",
            headerStyle: (colum, colIndex) => {
                return { width: '100px' };
              }
        }];
    
        return columns;
    }

    async componentDidMount()
    {
        _docno =  this.props.match.params.id
        const [name, pfs_id, pos] = Cookies.get("person").split("/")
        let result = await Axios.post("http://10.32.1.169:5001/api/recex_report", { docno: this.props.match.params.id, user: pfs_id })  
        
        let data = [];
        let data2 = [];
        let valChk = [];

        if (result.data.length !== 0)  
        {
            //ข้อมูลทั่วไป
            let chkRec = false;
            let chkExtra = false;  
            var _docdate = '';
            var _snddate = '';

            result.data.data_h && result.data.data_h.map((v) => {
           
                chkRec = v.rec       //ค่าตัวประเถทเอกสารที่คีย์เข้ามา
                chkExtra = v.extra
                _docdate = moment(v.date).format("DD-MM-YYYY")    //moment(v.date).utc().format("YYYY-MM-DD")
                _snddate = moment(v.snddate).format("DD-MM-YYYY")   //moment(v.snddate).format("YYYY-MM-DD")

                data.push({
                    title: v.title,
                    rec: v.rec,
                    extra: v.extra,
                    docno: v.docno,
                    date: v.date,
                    snddate: v.snddate,
                    code: v.code,
                    custname: v.custname,
                    area: v.area,
                    saleman: v.saleman,
                    sname: v.sname,
                    odno: v.odno,
                    pkno: v.pkno,
                    country: v.country,
                    disc: v.disc,
                    disc_net: v.disc_net,
                    cr_term: v.cr_term,
                    deposit: v.deposit,
                    remark: v.remark,
                    kasorb_to: v.kasorb_to,
                    kasorb_no: v.kasorb_no,
                    kasorb_style: v.kasorb_style,
                    kasorb_qty: v.kasorb_qty,
                    kasorb_dozen: v.kasorb_dozen,
                    kasorb_rmk1: v.kasorb_rmk1,
                    kasorb_rmk2: v.kasorb_rmk2,
                })
            })

             //Transection
             result.data.data_d && result.data.data_d.map((v, index) => {

                data2.push({
                    id: v.no,
                    prodcode: v.prodcode,
                    color: v.desc,
                    size: v.size,
                    qty: v.qty,
                    price: v.price,
                    amt: (parseInt(v.qty) *  v.price),
                    remark: v.remark,
                })
             })

             if ( chkRec === true && chkExtra === true )
             {
                 valChk = ['rec', 'extra'];
             }
             else if ( chkRec === true && chkExtra === false )
             {
                valChk = ['rec'];
             }
             else  
             {
                valChk = ['extra'];
             }
        }

        this.setState({ head: data, detail: data2, checkedList: valChk, docdate: _docdate, snddate: _snddate });
    }
      
    render() 
    {
        //เลือกเเถวในตาราง
        const selectRow = {
            mode: 'radio',
            clickToSelect: true,
            onSelect: (row, isSelect, rowIndex, e) => {
              console.log("รหัสที่เลือก :", row.id)
            }
          };
        
       //เก็บค่าตัวแปร ส่วนลด Net
        var bool = false;
        this.state.head.map( v =>{
            return  bool = v.disc_net
        })

        const options = [
            { label: 'งานสั่งทำ', value: 'rec' },
            { label: 'สินค้าราคาพิเศษ', value: 'extra' },
          ];

        return (
            <div className="animated fadeIn">
                <Card>
                <CardHeader style={{ backgroundColor: 'rgb(194, 214, 214)' }}></CardHeader> 
                    <CardBody>
                        <Row>
                            <Col md='12'>
                                <h4 style={{ textAlign: 'center',  }}>ใบเปิด ORDER</h4>
                            </Col>
                        </Row>
                        <Row>
                            <Col md='12' style={{ display:'flex', justifyContent:'center' }}>
                                <Checkbox.Group 
                                    options={ options } 
                                    value={ this.state.checkedList }
                                    defaultValue={ this.state.checkedList }   
                                    onChange={ this.onChangeChkBox } 
                                />
                            </Col>  
                        </Row>
                        <Row>
                            <Col md='2'>
                                <p style={{ textAlign: 'right' }}>วันที่รับ ORDER :</p>
                            </Col>
                            <Col md='10' style={{ textAlign: 'left' }}>
                                <Space direction="vertical" size={15}>
                                    <DatePicker value={moment(this.state.docdate, dateFormat)}format={dateFormat} disabled={true} />
                                </Space>
                            </Col>
                        </Row>
                        <Row>
                            <Col md='2'>
                                <p style={{ textAlign: 'right', paddingTop:'7px' }}>กำหนดส่ง :</p>
                            </Col>
                            <Col md='10' style={{ textAlign: 'left', marginTop:'5px' }}>
                                <Space direction="vertical">
                                    <DatePicker value={moment(this.state.docdate, dateFormat)} format={dateFormat} />
                                </Space>
                            </Col>
                        </Row>                 
                           <Form>
                            <FormGroup>
                                <Row>
                                    <Col md='2'>
                                        <Label style={{ display:'flex', justifyContent:'flex-end', paddingTop:'7px' }} for="exampleEmail">ร้านค้า :</Label>
                                    </Col>
                                    <Col md='4' style={{ marginTop:'3px' }} >
                                        <Input style={{ color:'brown' }} type="custname" name="custname" id="custname" data-index='0' placeholder="ชื่อลูกค้า / ร้านค้า" value={this.state.head.map(v =>{
                                            return v.custname
                                        })} onChange={this.handleChange} disabled={true}/>
                                    </Col>
                                    <Col md='1'>
                                        <p style={{ paddingTop:'6px', textAlign:'right', fontSize:'10'}}>Code :</p> 
                                    </Col>
                                    <Col md='2'>
                                        <Input style={{ color:'brown' }} type="text" name="code" id="_code" placeholder="รหัสร้านค้า" value={this.state.head.map(v => {
                                            return v.code
                                        })} disabled={true} />
                                    </Col>
                                </Row>
                                <Row>
                                    <Col md='2'>
                                        <Label style={{ display:'flex', justifyContent:'flex-end', paddingTop:'7px' }} for="exampleEmail">สถานที่ส่ง :</Label>
                                    </Col>
                                    <Col md='4' style={{ marginTop:'4px' }}>
                                        <Input style={{ color:'brown' }} type="area" name="area" id="_area" placeholder="" value={this.state.head.map(v =>{
                                            return v.area
                                        })} onChange={this.handleChange} />
                                    </Col>
                                    <Col md='1'>
                                          <Label style={{ display:'flex', justifyContent:'flex-end', paddingTop:'7px' }} for="exampleEmail">Sale :</Label>
                                    </Col>
                                    <Col md='3' style={{ marginTop:'3px' }}>
                                        <Input style={{ color:'brown' }} type="sale" name="sale" id="_sale" placeholder="" value={this.state.head.map(v =>{
                                            return v.saleman + ' ' + v.sname
                                        })} disabled={true} />
                                    </Col>
                                </Row>
                                <Row>
                                    <Col md='2' style={{ marginTop:'8px' }}>
                                       <Label style={{ display:'flex', justifyContent:'flex-end', paddingTop:'7px' }} for="exampleEmail">OD :</Label>
                                    </Col>
                                    <Col md='3' style={{ marginTop:'10px' }}>
                                        <Input style={{ color:'brown' }} type="odno" name="odno" id="_odno" placeholder="" value={this.state.head.map(v =>{
                                            return v.odno
                                        })} onChange={this.handleChange}/>
                                    </Col>
                                    <Col md='1' style={{ marginTop:'10px' }}>
                                       <Label style={{ display:'flex', justifyContent:'flex-end', paddingTop:'7px' }} for="exampleEmail">PK :</Label>
                                    </Col>
                                    <Col md='3' style={{ marginTop:'10px' }}>
                                       <Input style={{ color:'brown' }} type="pkno" name="pkno" id="_pkno" placeholder="" value={this.state.head.map(v =>{
                                           return v.pkno
                                       })} onChange={this.handleChange} />
                                    </Col>
                                </Row>
                                <Row>
                                    <Col md='2' style={{ marginTop:'8px' }}>
                                       <Label style={{ display:'flex', justifyContent:'flex-end', paddingTop:'7px' }} for="exampleEmail">ประเทศ :</Label>
                                    </Col>
                                    <Col md='2' style={{ marginTop:'10px' }}>
                                        <Input type="country" name="country" id="_country" placeholder="" value={this.state.head.map(v =>{
                                            return v.country
                                        })} onChange={this.handleChange} />
                                    </Col>
                                    <Col md='1' style={{ marginTop:'10px' }}>
                                       <Label style={{ display:'flex', justifyContent:'flex-end', paddingTop:'7px' }} for="exampleEmail">ส่วนลด :</Label>
                                    </Col>
                                    <Col md='1' style={{ marginTop:'10px', display:'flex', justifyContent:'flex-start' }}>
                                        <Input style={{ color:'brown', textAlign:'right' }} type="number" name="disc" id="_disc" placeholder="0.00" value={this.state.head.map(v =>{
                                            return v.disc
                                        })} onChange={this.handleChange} />
                                    </Col>
                                    <Col md='1' style={{ marginTop:'15px' }}>
                                       <Checkbox 
                                           checked={bool}
                                           onChange={this.onChangeCrChkBox} 
                                       >Net</Checkbox>
                                    </Col>
                                    <Col md='1'>
                                       <Label style={{ display:'flex', justifyContent:'flex-end', paddingTop:'15px' }} for="">มัดจำ :</Label>
                                    </Col>
                                    <Col md='2' style={{ marginTop:'10px' }}>
                                       <Input style={{ color:'brown', textAlign:'right' }} type="number" name="deposit" id="_deposit" placeholder="0.00" value={this.state.head.map(v => {
                                           return v.deposit
                                       })} onChange={this.handleChange} />
                                    </Col>
                                </Row>
                                <Row>
                                    <Col md='2' style={{ marginTop:'10px' }}>
                                       <Label style={{ display:'flex', justifyContent:'flex-end', paddingTop:'7px' }} for="">หมายเหตุ :</Label>
                                    </Col>
                                    <Col md='7' style={{ marginTop:'10px' }}>
                                       <Input style={{ color:'#cc6600', background: 'white' }} type="text" name="remark" id="_remark" placeholder="" value={this.state.head.map(v =>{
                                           return v.remark
                                       })} onChange={this.handleChange}/>
                                    </Col>
                                </Row>
                            </FormGroup>
                           </Form>       
                                <BootstrapTable
                                    keyField="id"
                                    data={ this.state.detail }
                                    columns={ this.getcolumnlist() }
                                    cellEdit={ cellEditFactory({ mode: 'click', blurToSave: true }) } //dbclick
                                    // selectRow= { selectRow }
                                />    
                            <Row>
                                <Col style={{ marginTop:'15px', display:'flex', justifyContent:'flex-end' }}>
                                   <Button color="success" onClick={this.handleSaveBtn} >บันทึก</Button>
                                   <Button style={{ marginLeft: '5px' }} color="danger" onClick={ this.handleDocCancel } >ยกเลิก</Button>
                                </Col>
                            </Row>    
                    </CardBody>
                </Card>
            </div>
        )
    }
}

export default AeRecfirm;