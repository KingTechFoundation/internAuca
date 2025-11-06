package com.example.ElisaInternership.service;

import com.example.ElisaInternership.model.AuditLog;
import com.example.ElisaInternership.model.User;
import com.example.ElisaInternership.repository.AuditLogRepository;
import jakarta.servlet.http.HttpServletRequest;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.web.context.request.RequestContextHolder;
import org.springframework.web.context.request.ServletRequestAttributes;

@Service
public class AuditService {
    @Autowired
    private AuditLogRepository auditLogRepository;

    public void logAction(String action, String entityType, Long entityId, User user, String description) {
        AuditLog auditLog = new AuditLog();
        auditLog.setAction(action);
        auditLog.setEntityType(entityType);
        auditLog.setEntityId(entityId);
        auditLog.setUser(user);
        auditLog.setDescription(description);

        try {
            ServletRequestAttributes attributes = (ServletRequestAttributes) RequestContextHolder.getRequestAttributes();
            if (attributes != null) {
                HttpServletRequest request = attributes.getRequest();
                auditLog.setIpAddress(request.getRemoteAddr());
            }
        } catch (Exception e) {
            // Ignore if unable to get IP
        }

        auditLogRepository.save(auditLog);
    }
}

