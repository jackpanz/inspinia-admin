package com.test.entity;
import com.baomidou.mybatisplus.annotation.TableName;
import com.baomidou.mybatisplus.annotation.IdType;
import com.baomidou.mybatisplus.annotation.Version;
import com.baomidou.mybatisplus.annotation.TableId;
import java.io.Serializable;
import lombok.Data;
import lombok.EqualsAndHashCode;
import lombok.experimental.Accessors;
/**
 * <p>
 * 用户基本信息表
 * </p>
 *
 * @author bj
 * @since 2019-04-02
 */
@Data
@EqualsAndHashCode(callSuper = false)
@Accessors(chain = true)
@TableName("t_user")
public class User implements Serializable {

    private static final long serialVersionUID = 1L;

    @TableId(value = "id", type = IdType.AUTO)
    private Integer id;

    /**
     * 昵称
     */
    private String name;

    /**
     * 0:女 1:男
     */
    private Integer gender;

    /**
     * 区号
     */
    private String dial_code;

    /**
     * 手机
     */
    private String mobile;

    /**
     * 登录密码
     */
    private String password;

    /**
     * 头像
     */
    private String icon;

    /**
     * 省份
     */
    private Integer province_id;

    /**
     * 城市
     */
    private Integer city_id;

    /**
     * 身高
     */
    private Integer height;

    /**
     * 職業
     */
    private String profession;

    /**
     * 情感狀況
     */
    private String emotion;

    /**
     * 体重
     */
    private Integer weight;

    /**
     * 个人介绍
     */
    private String introduction;

}
