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

class Approved extends Component {

    state = {
        columns: [],
        data: []
    }

    async componentDidMount()
    {
        this.setState({
            columns: [
                {
                    title: 'CustomerID',
                    dataIndex: 'customerID',
                  },
                  {
                    title: 'Name',
                    dataIndex: 'fullname',
                  },
                  {
                    title: 'Address',
                    dataIndex: 'address',
                  },
                  {
                    title: 'Phone',
                    dataIndex: 'phone',
                  },
                  {
                    title: 'Email',
                    dataIndex: 'email',
                  },
                  {
                    title: 'วันที่สมัคร',
                    dataIndex: 'predate',
                    defaultSortOrder: 'descend',
                    sorter: (a, b) => new Date(a.predate) - new Date(b.predate),
                    ellipsis: true,
                  },
                  {
                    title: 'วันที่อนุมัติ',
                    dataIndex: 'allowed_date',
                    defaultSortOrder: 'descend',
                    sorter: (a, b) => new Date(a.allowed_date) - new Date(b.allowed_date),
                    ellipsis: true,
                  },
            ]
        })

        let result = await Axios.get('http://10.32.0.86:81/onlinewholesale_backend/api/getcustomer');
      
        console.log("-- ", result.data)
      
          if (result.data.success === true) {
        
            let data2 = [];
            result.data.data && result.data.data.map((value, idx) => {
      
              console.log("customerID : ", value.customerID)
              data2.push({
                key: idx,
                customerID: value.customerID,
                fullname: value.fullname,
                address: value.address,
                phone: value.phone,
                email: value.email,
                predate: Moment(value.predate).format("DD-MM-YYYY"),
                allowed_date: Moment(value.allowed_date).format("DD-MM-YYYY"),
              })
            })
      
            this.setState({ data: data2 });

        }
    }

    onChange = (pagination, filters, sorter, extra) => {
        console.log('params', pagination, filters, sorter, extra);
    
        this.setState({
          sortedInfo: sorter,
        })
      }

    render() {

        return (
            <div className="animated fadeIn">
                 <Row>
                    <Col xs={12}>
                        <Card>
                        <CardHeader>เอกสารผ่านการสมัคร</CardHeader>
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
}

export default Approved;