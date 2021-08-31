import request from '../utils/request';

export const baseUrl = 'http://192.168.1.108:5555'
// export const baseUrl = 'http://localhost:5555'

// 创建分组
export const AddGroup = data => {
    return request({
        url: baseUrl + '/search/group',
        method: 'post',
        headers: {
            'Content-Type': 'multipart/form-data'
        },
        data: data
    });
};
// 向分组内添加词
export const addTask = data => {
    return request({
        url: baseUrl + '/search/task',
        method: 'post',
        data: data
    });
};
// 执行分组采词推荐任务
export const executeSearchRecommendTask = data => {
    return request({
        url: baseUrl + '/search/execute_task',
        method: 'post',
        data: data
    });
};

export const fetchSearchRecommendData = query => {
    return request({
        url: baseUrl + '/search/execute_task',
        method: 'get',
        params: query
    });
};

export const fetchBestSellersData = query => {
    return request({
        // url: './best_sellers_table.json',
        url: baseUrl + '/class',
        method: 'get',
        params: query
    });
};

export const fetchBestSellersGroupData = query => {
    return request({
        // url: './best_sellers_table.json',
        url: baseUrl + '/group',
        method: 'get',
        params: query
    });
};



export const fetchBestSellersBestBrandData = query => {
    return request({
        // url: './best_sellers_table.json',
        url: baseUrl + '/best_brand',
        method: 'get',
        params: query
    });
};

export const fetchSalesAndReviews = query => {
    return request({
        url: baseUrl + '/sales_reviews',
        method: 'get',
        params: query
    });
};

