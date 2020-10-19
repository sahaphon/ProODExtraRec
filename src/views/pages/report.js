import React from 'react';
import ReactToPrint from 'react-to-print';
import { Table, Row, Col } from "react-bootstrap";
import Axios from 'axios';
import Moment from 'moment';
import Numeral from "numeral";       //format currrentcy

class PreparingData extends React.Component {

   state = {
       data: [],
       data_d: [],
       disc_net: '',
       sumQty: 0,
       totPrice: 0,
   };

   async componentDidMount ()
   {
    //    console.log("รหัส : ", this.props.id);
       let result = await Axios.post("http://10.32.1.169:5001/api/recex_report", { docno: this.props.id })  
        
        if (result.data.length !== 0)
        {
            const dt = [];
            const dt_d = [];
            result.data.data_h && result.data.data_h.map((v, index) => {

                if (index === 0)
                {
                    if (v.disc_net === true)
                    {
                        this.setState({ disc_net: 'NET' })
                    }
                    else
                    {
                        this.setState({ disc_net: v.disc })
                    }
                }

                dt.push({
                    title: v.title,
                    docno: v.docno,
                    date: v.date,
                    snddate: v.snddate,
                    code: v.code,
                    cname: v.custname,
                    area: v.area,
                    saleman: v.saleman,
                    sale_name: v.sname,
                    od: v.odno,
                    pk: v.pkno,
                    country: v.country,
                    disc: v.disc,
                    disc_net: v.disc_net,
                    cr_term: v.cr_term,
                    depost: v.deposit,
                    remark: v.remark,
                    sign2: v.pos2,
                    sign3: v.pos3,
                    sign4: v.pos4,
                    sign5: v.pos5,
                    sign6: v.pos6,
                    sign7: v.pos7,
                    kasorb_to: v.kasorb_to,
                    kasorb_no: v.kasorb_no,
                    kasorb_style: v.kasorb_style,
                    kasorb_qty: v.kasorb_qty,
                    kasorb_dz: v.kasorb_dozen,
                    kasorb_rmk: v.kasorb_rmk1,
                    kasorb_rmk2: v.kasorb_rmk2,
               })
            })

            console.log(dt)
            this.setState({ data: dt });

            var totQty = 0;
            var totPrice = 0;
            result.data.data_d && result.data.data_d.map((val) => {

               totQty = totQty + val.qty
               totPrice = totPrice + val.price
               dt_d.push({
                   prodcode: val.prodcode,
                   colordesc: val.desc,
                   size: val.size,
                   qty: val.qty,
                   price: val.price,
                   amt: val.amt,
                   remark: val.remark,
               })
            })

            this.setState({ data_d: dt_d, sumQty: totQty, totPrice: totPrice });
        }
        else
        {
            console.log("No data..")
        }
   }
 
   render () {
       
      return (
          <div>
              <Row>
                  <Col xs='12'>
                      <p style={{ textAlign:"right", paddingRight:'3%' }}>F-SAL-04/01-0</p>
                  </Col>
              </Row>
              <Row>
                  <Col xs='12'>
                      <h4 style={{ textAlign:"center" }}>ใบเปิด ORDER</h4>
                  </Col>
              </Row>
              <Row>
                  <Col xs='12'>
                      <h5 style={{ textAlign:"center" }}>{ this.state.data.map((v) => {
                          return v.title
                      })} </h5>
                  </Col>
              </Row>
              <Row>
                  <Col xs='2'>
                      <p style={{ paddingLeft:'10%', fontSize:'18'}}>วันที่รับ ORDER : </p>
                  </Col>
                ​​  <Col xs='10'>
                      <p style={{ fontWeight: 'bold', fontSize:'18' }}>{this.state.data.map(v => {
                            return Moment(v.date).format("DD/MM/YYYY")
                        })}</p>
                  </Col>
              </Row>
              <Row>
                  <Col xs='2'>
                      <p style={{ paddingLeft:'10%', fontSize:'18' }}>กำหนดส่ง : </p>
                  </Col>
                  <Col xs='10'>
                      <p style={{ fontWeight: 'bold', fontSize:'18' }}>{this.state.data.map(v => {
                          return Moment(v.snddate).format("DD/MM/YYYY")
                      })}</p>
                  </Col>
              </Row>
              <Row>
                  <Col xs='2'>
                      <p style={{ paddingLeft:'10%', fontSize:'18'}}>ร้านค้า : </p>
                  </Col>
                  <Col xs='2'>
                      <p style={{ fontWeight: 'bold', fontSize:'18' }}>{this.state.data.map(v => {
                          return v.cname
                      })}</p>
                  </Col>
                  <Col xs='2'>
                     <p style={{ textAlign:'right', fontSize:'18' }}>รหัสร้านค้า : </p>
                  </Col>
                  <Col xs='6'>
                     <p style={{ fontWeight: 'bold', textAlign:'left', fontSize:'18' }}>{this.state.data.map(v => {
                          return v.code 
                       })}</p>
                  </Col>
              </Row>
              <Row>
                  <Col xs='2'>
                      <p style={{ paddingLeft:'10%', fontSize:'18' }}>สถานที่ส่ง : </p>
                  </Col>
                  <Col xs='10'>
                      <p style={{ fontWeight: 'bold', fontSize:'18' }}>{this.state.data.map(v => {
                          return v.area
                      })}</p>
                  </Col>
              </Row>
              <Row>
                  <Col xs='2'>
                     <p style={{ paddingLeft:'10%', fontSize:'18'}}>พนักงานขาย : </p>
                  </Col>
                  <Col xs='10'>
                      <p style={{ fontWeight:'bold', fontSize:'18' }}>{this.state.data.map(v => {
                         return v.saleman + ' ' + v.sale_name
                      })}</p>
                  </Col>
              </Row>
              <Row>
                  <Col xs='2'>
                      <p style={{ paddingLeft:'10%', fontSize:'18'}}>OD : </p> 
                  </Col>
                  <Col xs='4'>
                      <p style={{ fontWeight: 'bold', fontSize:'18' }}>{this.state.data.map(v => {
                         return v.od
                      })}</p>
                  </Col>
                  <Col xs='4'>
                  </Col>
                  <Col xs='2'>
                    <p style={{ textAlign:"left", fontSize:'18' }}>1. ส่วนลด : {this.state.disc_net}</p>
                  </Col>
              </Row>
              <Row>
                  <Col xs='2'>
                      <p style={{ paddingLeft:'10%', fontSize:'18'}}>PK : </p>
                  </Col>
                  <Col xs='4'>
                      <p style={{ fontSize:'18' }}>{this.state.data.map(v => {
                         return v.pk
                      })}</p>
                  </Col>
                  <Col xs='4'>
                  </Col>
                  <Col xs='2'>
                    <p style={{ textAlign:"left", fontSize:'18' }}>2. เครดิต : { this.state.data.map(v => {
                         return v.cr_term
                    })}</p>
                  </Col>
              </Row>
              <Row>
                  <Col xs='2'>
                      <p style={{ paddingLeft:'10%', fontSize:'18'}}>ประเทศ : </p>
                  </Col>
                  <Col xs='5'>
                      <p style={{ fontSize:'18' }}>{this.state.data.map(v => {
                         return v.country
                      })}</p>
                  </Col>
                  <Col xs='3'>
                  </Col>
                  <Col xs='2'>
                    <p style={{ textAlign:"left", fontSize:'18' }}>3. มัดจำ : {this.state.data.map(v => {
                         return this.state.depost
                    })}</p>
                  </Col>
              </Row>
              <Table responsive hover>
                <thead>
                    <tr style={{ whiteSpace: "nowrap" }}>
                        <th style={{ width:'17%', paddingLeft:'5%' }}>รหัสสินค้า</th>
                        <th style={{ width:'13%'}}>สี</th>
                        <th style={{ width:'10%'}}>Size</th>
                        <th style={{ width:'10%'}}>จำนวนคู่</th>
                        <th style={{ width:'10%'}}>ราคาพิเศษ</th>
                        <th style={{ width:'40%' }}>หมายเหตุ</th>
                    </tr>
                </thead>
                <tbody>
                   {this.ShowData()}
                   <tr>
                       <td colspan="3"><p style={{ textAlign:'center', fontWeight:'bolder', fontSize:'18' }}>GrandTotal : </p></td>
                       <td><u>{this.state.sumQty}</u></td>
                       <td><u>{this.state.totPrice}</u></td>
                   </tr>
                </tbody>
              </Table>
              { this.state.data.map( v => {
                  
                  //หากไม่ระบุใบปะหน้ากระสอบ ไม่ต้องแสดงข้อมูล
                  return v.kasorb_no !== null ?
                  <div>
                    <Row>
                        <Col xs='12'>
                            <h5 style={{ textAlign: 'left', fontWeight:'bolder', color:'gray', paddingLeft:'10%', fontSize:'18' }}>-------------- ใบปะหน้ากระสอบ -------------</h5>
                        </Col>
                    </Row>
                    <Row>
                        <Col xs='2'>
                        <p style={{ textAlign:'left', paddingLeft:'10%', fontSize:'18' }}>No.</p>
                        </Col>
                        <Col xs='4'>
                        <p style={{ textAlign:'left', fontSize:'18' }}>{this.state.data.map(v => {
                            return v.kasorb_no
                        })}</p>
                        </Col>
                    </Row>
                    <Row>
                        <Col xs='2'>
                            <p style={{ textAlign:'left', paddingLeft:'10%', fontSize:'18' }}>To :</p>
                        </Col>
                        <Col xs='4'>
                            <p style={{ textAlign:'left', fontWeight:'bold', fontSize:'18' }}>{this.state.data.map(v => {
                                return v.kasorb_to
                            })}</p>
                        </Col>
                    </Row>
                    <Row>
                        <Col xs='2'>
                            <p style={{ textAlign:'left', paddingLeft:'10%', fontSize:'18' }}>Style :</p>
                        </Col>
                        <Col xs='4'>
                            <p style={{ textAlign:'left', fontWeight:'bold', fontSize:'18' }}>{this.state.data.map(v => {
                                return v.style
                            })}</p>
                        </Col>
                    </Row>
                    <Row>
                        <Col xs='2'>
                            <p style={{ textAlign:'left', paddingLeft:'10%', fontSize:'18' }}>Qty :</p>
                        </Col>
                        <Col xs='2'>
                            <p style={{ textAlign:'left', fontWeight: 'bold', fontSize:'18' }}>{this.state.data.map(v => {
                                return v.qty
                            })}</p>
                        </Col>
                        <Col xs='1'>
                            <p style={{ textAlign:'left', fontSize:'18' }}>Dozen :</p>
                        </Col>
                        <Col xs='2'>
                            <p style={{ textAlign:'left', fontSize:'18' }}>{this.state.data.map(v => {
                                return v.kasorb_dozen
                            })}</p>
                        </Col>
                    </Row>
                    <Row>
                        <Col xs='4'>
                            <p style={{ textAlign:'left', paddingLeft:'10%', fontSize:'18' }}>{this.state.data.map(v => {
                                return v.remark
                            })}</p>
                        </Col>
                        <Col xs='4'>
                            <p style={{ textAlign:'left', fontSize:'18' }}>{this.state.data.map(v => {
                                return v.remark2
                            })}</p>
                        </Col>
                    </Row>
                  </div>
                    :
                  <div>
                  </div>
              })}

              <Row>
                  <Col xs='12'>
                    <p style={{ fontWeight: 'bolder', paddingLeft:'2%', fontSize:'18' }}>*** หมายเหตุในกรณีที่เอกสารนี้ไม่สอดคล้องกับ Memo ราคาพิเศษหรือ Memo งานสั่งทำฉบับก่อนหน้าต้องมีลายเซ็นค์รองกรรมการผู้จัดการ</p>
                  </Col>
              </Row>
              <Row style={{ marginTop:'20%' }}>
                  <Col xs='1'>
                  </Col>
                  <Col xs='2'>
                        <p style={{ textAlign:'center', color: 'gra', fontWeight:'bold', paddingTop:'20%', fontSize:'18' }}>{this.state.data.map(v => {
                            return v.sale_name
                        })}</p>
                  </Col>
                  <Col xs='2'>
                      {this.state.data.map((v) => {
                          return  v.sign3 === '' ? '' : <img src={"http://192.168.2.14/SignPic/" + v.sign3 + '.jpg'} alt="" />
                      })}
                  </Col>
                  <Col xs='2'> 
                      {this.state.data.map((v) => {
                          return  v.sign5 === '' ? '' : <img src={"http://192.168.2.14/SignPic/" + v.sign5 + '.jpg'} alt="" />
                      })}
                  </Col>
                  <Col xs='2'>
                     {this.state.data.map((v) => {
                          return  v.sign6 !== '39C62' ? '' : <img src={"http://192.168.2.14/SignPic/" + v.sign6 + '.jpg'} alt="" />
                      })}
                  </Col>
                  <Col xs='2'>
                    {this.state.data.map((v) => {
                       if (v.sign6 === '')
                       {
                           return '';
                       }
                       else if (v.sign6 === '39C62')
                       {
                           return v.sign7 === '' ? '' : <img src={"http://192.168.2.14/SignPic/" + v.sign7 + '.jpg'} alt="" /> 
                       }
                      })}
                  </Col>
                  <Col xs='1'>
                  </Col>
              </Row>
              <Row>
                  <Col xs='1'>
                  </Col>
                  <Col xs='2'>
                      <p style={{ textAlign:'center', color:'gray', fontSize:'18' }}>ผู้รับ ORDER</p>
                  </Col>
                  <Col xs='2'>
                      <p style={{ textAlign:'center', color:'gray', fontSize:'18' }}>ผจก.แผนก / ผจก.ฝ่ายขาย</p>
                  </Col>
                  <Col xs='2'>
                      <p style={{ textAlign:'center', color:'gray', fontSize:'18' }}>ผจก.แผนก / ผจก.ฝ่ายผลิตภัณฑ์</p>
                  </Col>
                  <Col xs='2'>
                      <p style={{ textAlign:'center', color:'gray', fontSize:'18' }}>รองกรรมการผู้จัดการ</p>
                  </Col>
                  <Col xs='2'>
                      <p style={{ textAlign:'center', color:'gray', fontSize:'18' }}>ผจก.แผนกติดตามรายได้</p>
                  </Col>
                  <Col xs='1'>
                  </Col>
              </Row>
          </div>
      )
   }

   ShowData() {

      let rows = Object.values(this.state.data_d).map((val, i) => {

          return (
             <tr key={i}>
                <td>{val.prodcode}</td>
                <td>{val.colordesc}</td>
                <td>{val.size}</td>
                <td>{Numeral(val.qty).format(0, 0)}</td>
                <td>{Numeral(val.price).format(0, 0)}</td>
                <td>{val.remark}</td>
             </tr>
          )
      })

      return rows;
  }
}

class Print extends React.Component {

    render() {
      // console.log("-->", this.props.match.params.no)
      return (
        <div>   
          <ReactToPrint
            trigger={() => <a href="#">พิมพ์รายงาน!</a>}
            content={() => this.componentRef}
          />
          <PreparingData ref={el => (this.componentRef = el)} 
             id = {this.props.match.params.id}/>
        </div>
      );
    }
  }

export default Print;
