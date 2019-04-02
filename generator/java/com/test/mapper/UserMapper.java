package com.test.mapper;

import com.test.entity.User;
import com.baomidou.mybatisplus.core.mapper.BaseMapper;
import org.apache.ibatis.annotations.Param;
import com.baomidou.mybatisplus.core.metadata.IPage;
import java.util.Map;
import java.util.List;

/**
 * <p>
 * 用户基本信息表 Mapper 接口
 * </p>
 *
 * @author bj
 * @since 2019-04-02
 */
public interface UserMapper extends BaseMapper<User> {

    List selectSimple(IPage pagination, @Param("p") Map params);

    List selectMapSimple(IPage pagination, @Param("p") Map params);

}
