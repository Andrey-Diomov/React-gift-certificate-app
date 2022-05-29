import { Pagination } from "antd";
import React from "react";
import { getCertificateSearchData } from "../util/certificateSearchData";
import { useSearchParams } from 'react-router-dom';


export const CreatePagination = (props) => {
    const [searchParams, setSearchParams] = useSearchParams();
    const pageSize = props.pageSize;

    let searchData = getCertificateSearchData();
    searchData = searchData ? searchData : {};

    const handlePageClick = (page, pageSize) => {
        searchData.pageNumber = page;
        searchData.pageSize = pageSize;
        setSearchParams(searchData);
        window.location.reload();
    }

    return (
        <div className='pagination'>
            <Pagination className='pag'
                onChange={handlePageClick}
                current={props.pageNumber}
                total={props.totalElements}
                defaultPageSize={props.pageSize}
                pageSize={pageSize < 4 ? 2 : (props.pageSize > 4 ? 6 : 4)}
                pageSizeOptions={[2, 4, 6]}
            />
        </div >
    )
}