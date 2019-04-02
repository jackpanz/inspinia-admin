package com.test.service.impl;

import com.test.entity.User;
import com.test.mapper.UserMapper;
import com.baomidou.mybatisplus.extension.service.impl.ServiceImpl;
import org.springframework.stereotype.Service;
import com.baomidou.mybatisplus.core.metadata.IPage;
import java.util.Map;

/**
 * <p>
 * 用户基本信息表 服务实现类
 * </p>
 *
 * @author bj
 * @since 2019-04-02
 */
@Service
public class UserServiceImpl extends ServiceImpl<UserMapper, User>{

    public IPage selectSimple(IPage pagination, Map params){
        pagination.setRecords(baseMapper.selectSimple(pagination,params));
        return pagination;
    }

    public IPage selectMapSimple(IPage pagination, Map params){
        pagination.setRecords(baseMapper.selectMapSimple(pagination,params));
        return pagination;
    }
}
