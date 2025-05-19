package com.evotickets.entities;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.Collection;
import java.util.List;

import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.core.userdetails.UserDetails;

import com.evotickets.entities.enums.UserRole;
import com.fasterxml.jackson.annotation.JsonIgnore;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.EnumType;
import jakarta.persistence.Enumerated;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.OneToMany;
import jakarta.persistence.Table;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.ToString;

@Data
@Entity
@Builder
@NoArgsConstructor
@AllArgsConstructor
@ToString(exclude = "organizedEvents")
@Table(name = "users")
public class UserEntity implements UserDetails {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "user_id")
    private Long id;

    @Column(nullable = false, length = 50)
    private String firstName;

    @Column(nullable = false, length = 50)
    private String lastName;

    @Column(nullable = false, unique = true, length = 25)
    private String username;

    @Column(nullable = false, unique = true, length = 50)
    private String email;

    @Column(nullable = false)
    private String password;

    @Column(name = "profile_picture", length = 250)
    private String profilePicture;

    @Column(name = "date_of_birth", nullable = false)
    private LocalDate dateOfBirth;

    @Enumerated(EnumType.STRING)
    @Column(name = "user_role", nullable = false)
    @Builder.Default
    private UserRole userRole = UserRole.CLIENT;

    @Builder.Default
    @Column(name = "account_activated", nullable = false)
    private boolean accountActivated = false;

    @Column(name = "verification_token")
    private String verificationToken;

    @Column(name = "verification_token_expires_at")
    private LocalDateTime verificationTokenExpiresAt;

    @Column(name = "reset_password_token")
    private String resetPasswordToken;

    @Column(name = "reset_password_token_expires_at")
    private LocalDateTime resetPasswordTokenExpiresAt;

    @Column(name = "suspended_until")
    private LocalDateTime suspendedUntil;

    @Builder.Default
    @Column(name = "failed_login_attempts", nullable = false)
    private int failedLoginAttempts = 0;

    @Column(name = "notifications_enabled", nullable = false)
    @Builder.Default
    private boolean notificationsEnabled = true;    

    @Override
    public Collection<? extends GrantedAuthority> getAuthorities() {
        return List.of((GrantedAuthority) () -> "ROLE_" + this.userRole.name());
    }

    @Override
    public boolean isAccountNonLocked() {
        if (suspendedUntil != null && suspendedUntil.isAfter(LocalDateTime.now())) {
            return false;
        }
        return accountActivated;
    }

    @Override
    public boolean isCredentialsNonExpired() {
        return true;
    }

    @Override
    public boolean isEnabled() {
        return accountActivated;
    }

    @Override
    public String getPassword() {
        return password;
    }

    @Override
    public String getUsername() {
        return username;
    }

    public boolean isNotificationsEnabled() {
        return notificationsEnabled;
    }

    @OneToMany(mappedBy = "organizer")
    @JsonIgnore
    private List<EventEntity> organizedEvents;
}
