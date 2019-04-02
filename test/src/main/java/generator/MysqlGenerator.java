package generator;


import com.baomidou.mybatisplus.annotation.DbType;
import com.baomidou.mybatisplus.generator.AutoGenerator;
import com.baomidou.mybatisplus.generator.InjectionConfig;
import com.baomidou.mybatisplus.generator.config.*;
import com.baomidou.mybatisplus.generator.config.converts.MySqlTypeConvert;
import com.baomidou.mybatisplus.generator.config.po.TableFill;
import com.baomidou.mybatisplus.generator.config.po.TableInfo;
import com.baomidou.mybatisplus.generator.config.rules.DbColumnType;
import com.baomidou.mybatisplus.generator.config.rules.IColumnType;
import com.baomidou.mybatisplus.generator.config.rules.NamingStrategy;
import com.baomidou.mybatisplus.generator.engine.BeetlTemplateEngine;
import org.apache.commons.lang3.StringUtils;

import java.io.File;
import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

/*
•
• 　       　┏┓　　　┏┓
• 　       ┏┛┻━━━┛┻┓
• 　       ┃　　　　　　　┃
• 　       ┃　　　━　　　┃
• 　       ┃　┳┛　┗┳　┃
• 　       ┃　　　　　　　┃
• 　       ┃　　　┻　　　┃
• 　       ┃　　　　　　　┃
• 　       ┗━┓　　　┏━┛
• 　       　　┃　　　┃
• 　       　　┃　　　┃
• 　       　　┃　　　┗━━━┓
• 　       　　┃　　　　　　　┣┓
• 　       　　┃　　　　　　　┏┛
• 　       　　┗┓┓┏━┳┓┏┛
• 　       　　　┃┫┫　┃┫┫
• 　       　　　┗┻┛　┗┻┛
• ━━━━━━ 神兽保佑,代码无BUG ━━━━━━ 
*/

/**
 * <p>
 * 代码生成器演示
 * </p>
 *
 * @author hubin
 * @date 2016-12-01
 */
public class MysqlGenerator {

    private static Map conf = new HashMap() {
        {
//            //jdbc
//            put("jdbc.driver", "com.mysql.jdbc.Driver");
//            put("jdbc.url", "jdbc:mysql://127.0.0.1:3306/dsej?characterEncoding=utf8");
//            put("jdbc.user", "root");
//            put("jdbc.pass", "root");
//
//            //config
//            put("packageName", "com.maccloud.dsej");
//            put("superEntityClass", "com.maccloud.basic.BasicEntity");


            //jdbc
            put("jdbc.driver", "com.mysql.jdbc.Driver");
            put("jdbc.url", "jdbc:mysql://127.0.0.1:3306/demo_db?characterEncoding=utf8");
            put("jdbc.user", "root");
            put("jdbc.pass", "root");

            //config
            put("packageName", "com.test");

            //tables
            put("tables", new String[]{
                    "t_user",
            });

            put("tablePrefix", new String[]{"t_"});
//            put("pagePath", "/admin");
            put("pagePath", "");
        }
    };

    /**
     * <p>
     * MySQL 生成演示
     * </p>
     */
    public static void main(String[] args) {

        generator();


    }


    public static void generator() {


        // 自定义需要填充的字段
        List<TableFill> tableFillList = new ArrayList<>();
        //tableFillList.add(new TableFill("ASDD_SS", FieldFill.INSERT_UPDATE));
        final String projectRoot = System.getProperty("user.dir");

        // 代码生成器
        AutoGenerator mpg = new AutoGenerator().setGlobalConfig(
                // 全局配置
                new GlobalConfig()
                        .setOutputDir(projectRoot + "/generator/java/")//输出目录
                        .setFileOverride(true)// 是否覆盖文件
                        .setActiveRecord(false)// 开启 activeRecord 模式
                        .setEnableCache(false)// XML 二级缓存
                        .setBaseResultMap(true)// XML ResultMap
                        .setBaseColumnList(true)// XML columList
                        .setServiceName("%sService")
                        .setAuthor("bj")
                // 自定义文件命名，注意 %s 会自动填充表实体属性！
                // .setMapperName("%sDao")
                // .setXmlName("%sDao")
                // .setServiceName("MP%sService")
                // .setServiceImplName("%sServiceDiy")
                // .setControllerName("%sAction")
        ).setDataSource(
                // 数据源配置
                new DataSourceConfig()
                        .setDbType(DbType.MYSQL)// 数据库类型
                        .setTypeConvert(new MySqlTypeConvert() {
                            // 自定义数据库表字段类型转换【可选】
                            @Override
                            public IColumnType processTypeConvert(GlobalConfig globalConfig, String fieldType) {
                                System.out.println("转换类型：" + fieldType);
//                                 if ( fieldType.toLowerCase().contains( "tinyint" ) ) {
//                                    return DbColumnType.BOOLEAN;
//                                 }
                                if (fieldType.toLowerCase().contains("point")) {
                                    return DbColumnType.OBJECT;
                                }
                                if (fieldType.toLowerCase().contains("datetime")) {
                                    return DbColumnType.DATE;
                                }
                                return super.processTypeConvert(globalConfig,fieldType);
                            }
                        })
                        .setDriverName((String) conf.get("jdbc.driver"))
                        .setUsername((String) conf.get("jdbc.user"))
                        .setPassword((String) conf.get("jdbc.pass"))
                        .setUrl((String) conf.get("jdbc.url"))
        ).setStrategy(
                // 策略配置
                new StrategyConfig()
                        // .setCapitalMode(true)// 全局大写命名
                        //.setDbColumnUnderline(false)//全局下划线命名
                        .setNaming(NamingStrategy.underline_to_camel)// 表名生成策略
                        .setColumnNaming(NamingStrategy.no_change)
                        .setTablePrefix((String[]) conf.get("tablePrefix"))// 此处可以修改为您的表前缀
                        .setInclude((String[]) conf.get("tables")) // 需要生成的表
                        // .setExclude(new String[]{"test"}) // 排除生成的表
                        // 自定义实体父类
                        // .setSuperEntityClass("com.baomidou.demo.TestEntity")
                        // 自定义实体，公共字段
                        //.setSuperEntityColumns(new String[]{"test_id"})
                        .setTableFillList(tableFillList)
//                        .setSuperEntityClass((String) conf.get("superEntityClass"))
//                        .setColumnNaming(NamingStrategy.nochange)
//                        .setEntityPropertyNamingStrategy(NamingStrategy.nochange)
                        .setEntityLombokModel(true)
                        .setVersionFieldName("version")

                // 自定义 mapper 父类
                // .setSuperMapperClass("com.baomidou.demo.TestMapper")
                // 自定义 service 父类
                // .setSuperServiceClass("com.baomidou.demo.TestService")
                // 自定义 service 实现类父类
                // .setSuperServiceImplClass("com.baomidou.demo.TestServiceImpl")
                // 自定义 controller 父类
                // .setSuperControllerClass("com.baomidou.demo.TestController")
                // 【实体】是否生成字段常量（默认 false）
                // public static final String ID = "test_id";
                // .setEntityColumnConstant(true)
                // 【实体】是否为构建者模型（默认 false）
                // public User setName(String name) {this.name = name; return this;}
                //.setEntityBuilderModel(true)
                // 【实体】是否为lombok模型（默认 false）<a href="https://projectlombok.org/">document</a>
                // .setEntityLombokModel(true)
                // Boolean类型字段是否移除is前缀处理
                // .setEntityBooleanColumnRemoveIsPrefix(true)
                // .setRestControllerStyle(true)
                // .setControllerMappingHyphenStyle(true)
        ).setPackageInfo(
                // 包配置
                new PackageConfig()
                        //.setModuleName("eal")
                        .setParent((String) conf.get("packageName"))// 自定义包路径
                        .setController("controller")// 这里是控制器包名，默认 web
                        .setEntity("entity")
                        .setXml("mapper")
        );

        mpg.setTemplateEngine(new BeetlTemplateEngine());
        TemplateConfig templateConfig = new TemplateConfig()
                .setController("/plus/controller")
                .setServiceImpl("/plus/serviceImpl")
                .setMapper("/plus/mapper.java")
                .setService(null)
                .setXml(null);

        mpg.setTemplate(templateConfig);



//        mpg.setTemplate(
//        // 关闭默认 xml 生成，调整生成 至 根目录
//        new TemplateConfig()
//                .setXml("/plus/mapper_underline.xml.vm")
//                .setEntity("/plus/entity_underline.java.vm")
//        // 自定义模板配置，模板可以参考源码 /mybatis-plus/src/main/resources/template 使用 copy
//        // 至您项目 src/main/resources/template 目录下，模板名称也可自定义如下配置：
//        // .setController("...");
//        // .setEntity("...");
//        // .setMapper("...");
//        // .setXml("...");
//        // .setService("...");
//        // .setServiceImpl("...");
//        );

        final Map cfgMap = new HashMap<String, Object>() {{
            String pagePath = (String) conf.get("pagePath");
            if (StringUtils.isNotBlank(pagePath)) {
                if (!pagePath.startsWith("/")) {
                    pagePath = "/" + pagePath;
                }
                if (pagePath.endsWith("/")) {
                    pagePath = pagePath.substring(0, pagePath.length() - 1);
                }
                conf.put("pagePath", pagePath);
            }

            put("pagePath", conf.get("pagePath"));
        }};

        InjectionConfig cfg = new InjectionConfig() {
            @Override
            public void initMap() {
                // to do nothing
                setMap(cfgMap);
            }
        };

        List<FileOutConfig> focList = new ArrayList<>();
        // 自定义配置会被优先输出
        focList.add(new FileOutConfig("/plus/edit.btl") {
            @Override
            public String outputFile(TableInfo tableInfo) {
                String objectName = tableInfo.getEntityName().substring(0,1).toLowerCase()+tableInfo.getEntityName().substring(1);
                cfgMap.put("entityName",objectName);
                cfgMap.put("titleName", StringUtils.isBlank(tableInfo.getComment()) ? objectName : tableInfo.getComment().trim() );
                String filePath = projectRoot+"/generator/pages" + conf.get("pagePath") + "/"+ objectName + "/edit.btl";
                File file = new File(filePath);
//                System.out.println("========" + projectRoot+"/"+tableInfo.getName());
                return file.getPath();
            }
        });
        focList.add(new FileOutConfig("/plus/list.btl") {
            @Override
            public String outputFile(TableInfo tableInfo) {
                String objectName = tableInfo.getEntityName().substring(0,1).toLowerCase()+tableInfo.getEntityName().substring(1);
                cfgMap.put("entityName",objectName);
                cfgMap.put("titleName", StringUtils.isBlank(tableInfo.getComment()) ? objectName : tableInfo.getComment().trim() );
                String filePath = projectRoot+"/generator/pages" + conf.get("pagePath") + "/" + objectName + "/list.btl";
                File file = new File(filePath);
//                System.out.println("========" + projectRoot+"/"+tableInfo.getName());
                return file.getPath();
            }
        });
        focList.add(new FileOutConfig("/plus/mapper.xml.btl") {
            @Override
            public String outputFile(TableInfo tableInfo) {
                String objectName = tableInfo.getEntityName().substring(0,1).toLowerCase()+tableInfo.getEntityName().substring(1);
                cfgMap.put("entityName",objectName);
                cfgMap.put("titleName", StringUtils.isBlank(tableInfo.getComment()) ? objectName : tableInfo.getComment().trim() );
//                System.out.println(tableInfo.get);
                String packageName = conf.get("packageName") + ".mapper";
                packageName =  packageName.replaceAll("\\.","/");
                String filePath = projectRoot + "/generator/mapper/" + packageName + "/" + tableInfo.getEntityName() + "Mapper.xml";
                File file = new File(filePath);
//                System.out.println("========" + file.getPath());
                return file.getPath();
            }
        });


        cfg.setFileOutConfigList(focList);
        mpg.setCfg(cfg);

        // 执行生成
        mpg.execute();
        // 打印注入设置，这里演示模板里面怎么获取注入内容【可无】
//        System.err.println(mpg.getCfg().getMap().get("abc"));
    }


}
