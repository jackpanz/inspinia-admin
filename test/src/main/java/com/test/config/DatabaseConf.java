package com.test.config;

import org.aspectj.lang.annotation.Aspect;
import org.springframework.aop.Advisor;
import org.springframework.aop.aspectj.AspectJExpressionPointcut;
import org.springframework.aop.support.DefaultPointcutAdvisor;
import org.springframework.beans.factory.annotation.Qualifier;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.transaction.PlatformTransactionManager;
import org.springframework.transaction.TransactionDefinition;
import org.springframework.transaction.interceptor.*;

import javax.sql.DataSource;
import java.util.Collections;
import java.util.HashMap;
import java.util.Map;

/*
//                       .::::.  
//                     .::::::::.  
//                    :::::::::::  
//                 ..:::::::::::'  
//              '::::::::::::'  
//                .::::::::::  
//           '::::::::::::::..  
//                ..::::::::::::.  
//              ``::::::::::::::::  
//               ::::``:::::::::'        .:::.  
//              ::::'   ':::::'       .::::::::.  
//            .::::'      ::::     .:::::::'::::.  
//           .:::'       :::::  .:::::::::' ':::::.  
//          .::'        :::::.:::::::::'      ':::::.  
//         .::'         ::::::::::::::'         ``::::.  
//     ...:::           ::::::::::::'              ``::.  
//    ```` ':.          ':::::::::'                  ::::..  
//                       '.:::::'                    ':'````..  
//  
*/

@Aspect
@Configuration
public class DatabaseConf {

    private static final int TX_METHOD_TIMEOUT = 5;
    
    private static final String AOP_POINTCUT_EXPRESSION = "execution (* com.test.service.impl.*.*(..))";

    private static final String TRANSACTION_FUNCTION = "add,insert,save,update,remove,del,order,set";

    @Bean
    public TransactionInterceptor txAdvice(PlatformTransactionManager transactionManager){
        NameMatchTransactionAttributeSource source = new NameMatchTransactionAttributeSource();

        /*只读事务，不做更新操作*/
        RuleBasedTransactionAttribute readOnlyTx = new RuleBasedTransactionAttribute();
        readOnlyTx.setReadOnly(true);
        readOnlyTx.setPropagationBehavior(TransactionDefinition.PROPAGATION_NOT_SUPPORTED);
//        readOnlyTx.setPropagationBehavior(TransactionDefinition.PROPAGATION_REQUIRED);

        /*当前存在事务就使用当前事务，当前不存在事务就创建一个新的事务*/
        RuleBasedTransactionAttribute requiredTx = new RuleBasedTransactionAttribute();
        requiredTx.setRollbackRules(Collections.singletonList(new RollbackRuleAttribute(Exception.class)));
        requiredTx.setPropagationBehavior(TransactionDefinition.PROPAGATION_REQUIRED);
        requiredTx.setTimeout(TX_METHOD_TIMEOUT);

        Map<String, TransactionAttribute> txMap = new HashMap<>();
        txMap.put("*", readOnlyTx);
        String[] funs = TRANSACTION_FUNCTION.split(",");
        for (int i = 0; i < funs.length; i++) {
            String fun = funs[i];
            txMap.put(fun + "*", requiredTx);
        }
        source.setNameMap(txMap);
        TransactionInterceptor txAdvice = new TransactionInterceptor(transactionManager, source);
        return txAdvice;
    }

    @Bean
    public Advisor txAdviceAdvisor(TransactionInterceptor txAdvice) {
        AspectJExpressionPointcut pointcut = new AspectJExpressionPointcut();
        pointcut.setExpression(AOP_POINTCUT_EXPRESSION);
        return new DefaultPointcutAdvisor(pointcut, txAdvice);
    }

    @Bean
    public JdbcTemplate jdbcTemplate(@Qualifier("dataSource") DataSource dataSource) {
        return new JdbcTemplate(dataSource);
    }

}
