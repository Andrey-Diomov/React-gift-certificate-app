import { Component } from "react"
import Footer from "../component/Footer";
import Header from "../component/Header";
import {message} from "antd";
import { setCertificateSearchData, removeCertificateSearchData } from "../util/certificateSearchData";
import { getCertificatePageData } from "../util/certificateHttpQuery"
import { TableCertificates } from "../component/TableCertificates";
import { CreatePagination } from "../component/Pagination";


export default class Certificate extends Component {
    constructor(props) {
        super(props);
        this.state = {
            allCertificatesData: {},
            certificates: []
        };
    }

    componentDidMount() {
        if (window.location.search.trim() !== '') {
            removeCertificateSearchData();
            setCertificateSearchData(window.location.search);
        } else {
            setCertificateSearchData({
                pageNumber: 1,
                pageSize: 5,
                sort: 'DESC'
            })
        }

        getCertificatePageData().then(data => {
            if (data?.errorMessage) {
                message.error({ content: data.errorMessage, style: { marginTop: '30vh', } }, 3)
            } else {
                this.setState({ allCertData: data, certificates: data?.list });
            }
        })
    }

    render() {
        return (
            <>
                <Header />
                <TableCertificates certificates={this.state.certificates} />
                <CreatePagination                 
                pageNumber = { this.state.allCertificatesData.pageNumber }
                lastPage = { this.state.allCertificatesData.lastPage }
                pageSize = { this.state.allCertificatesData.pageSize }
                totalElements = { this.state.allCertificatesData.totalElements }  
                />
                <Footer />
            </>
        );
    }
}