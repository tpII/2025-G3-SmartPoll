package smartpoll.backend.entity;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.core.userdetails.UserDetails;

import java.util.Collection;
import java.util.List;
import java.util.UUID;


@Table(name = "voters")
@Entity
@AllArgsConstructor
@NoArgsConstructor
@Data
public class VoterEntity implements UserDetails {
    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    @Column(nullable = false)
    private UUID id;

    @Column(unique = true, nullable = false)
    private Long DNI;

    @Column(unique = true, length = 100, nullable = false)
    private String email;

    @Column(nullable = false, name="password")
    private String hashedPassword;

    @Override
    public Collection<? extends GrantedAuthority> getAuthorities() {
        return List.of();
    }

    @Override
    public String getPassword() { return hashedPassword; }

    @Override
    public String getUsername() {
        return String.valueOf(DNI);
    }

    @Override public boolean isAccountNonExpired() { return true; }
    @Override public boolean isAccountNonLocked() { return true; }
    @Override public boolean isCredentialsNonExpired() { return true; }
    @Override public boolean isEnabled() { return true; }
}
