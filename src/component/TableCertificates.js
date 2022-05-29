import { message, Space, Table, Tag } from "antd";
import { AddOrEditCertificateModel } from "./model/AddOrEditCertificateModel";
import { DeleteCertificateModel } from "./model/DeleteCertificateModel";
import { ViewCertificateModel } from "./model/ViewCertificateModel";
import React, { useState } from "react";
import { getCertificateSearchData } from "../util/certificateSearchData";
import { useNavigate } from "react-router-dom";
import { isRoleAdmin } from "../util/userData";
import { deleteCert } from "../util/certificateHttpQuery";

const sort = 'sort';
const sortDate = 'sortDate';
const urlMain = "/gift-certificate-app";

export const TableCertificates = (props) => {

    const [certificates, setCertificates] = useState({ ...props });
    const [table, setTable] = useState({ page: 1 });
    const navigate = useNavigate();
    let searchUrl = new URLSearchParams(window.location.search)

    React.useEffect(() => {
        setCertificates(props);
    }, [props])

    const remove = (id) => {
        deleteCert(id).then(data => {
            if (data.errorMessage) {
                message.error(data.errorMessage, 5);
            } else {
                message.success( 'Delete OK: ' + data.message , 5)
                let updatedCertificates = [...certificates.certificates].filter(i => i.id !== id);
                setCertificates({ certificates: updatedCertificates });               
            }
        });
    }

    const handleTableClick = (pagination, filters, sorter, extra) => {
        if (table.page !== pagination.current) {
            setTable({ page: pagination.current });
            return;
        }

        const searchData = getCertificateSearchData();
        if (sorter.columnKey === "name") {
            searchData.sort = sorter.order === "ascend" ? 'ASC' : sorter.order === "descend" ? 'DESC' : '';
        }

        navigate(urlMain + "?" + new URLSearchParams(searchData));
        window.location.reload();
    }

    const columns = [
        {
            title: 'DateTime',
            dataIndex: 'createdDate',
            key: 'created',
        },

        {
            title: 'Title',
            dataIndex: 'name',
            key: 'name',
            defaultSortOrder: searchUrl.get(sort) === 'ASC' ? "ascend" : searchUrl.get(sort) === 'DESC' ? "descend" : "",
            sorter: () => { },
        },

        {
            title: 'Tags',
            key: 'tags',
            dataIndex: 'tags',
            render: tags => (
                <>
                    {tags.map(tag => { return (<Tag color={'pink'} key={tag}>{tag.name}</Tag>); })}
                </>
            ),
        },

        {
            title: 'Description',
            dataIndex: 'description',
            key: 'description'
        },

        {
            title: 'Price',
            dataIndex: 'price',
            key: 'price',
        },

        {
            title: 'Action',
            key: 'action',
            render: (_, certificate) => (
                <Space size="small" >
                    <a><ViewCertificateModel certificate={certificate} /></a>
                    {isRoleAdmin() ? <a><AddOrEditCertificateModel certificate={certificate} /></a> : ''}
                    {isRoleAdmin() ? < a > < DeleteCertificateModel certificate={certificate} onClick={() => remove(certificate.key)} /></a > : ''}
                </Space>
            )
        }
        
    ];

    const dataSource = certificates.certificates.map(certificate => {
        return {
            key: certificate.id,
            name: certificate.name,
            description: certificate.description,
            price: certificate.price,
            duration: certificate.duration,
            createdDate: certificate.created,
            //modifiedDate: cert.modifiedDate,
            tags: certificate.tags,
            action: certificate
        }
    });

    return (
        <>
            <Table dataSource={dataSource} columns={columns} onChange={handleTableClick}  />;
        </>
    );
}

