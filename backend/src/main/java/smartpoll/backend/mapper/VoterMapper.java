package smartpoll.backend.mapper;

import org.springframework.security.crypto.password.PasswordEncoder;
import org.mapstruct.*;
import org.mapstruct.factory.Mappers;
import smartpoll.backend.dto.AuthResponse;
import smartpoll.backend.dto.VoterRequest;
import smartpoll.backend.entity.VoterEntity;

@Mapper(componentModel = "spring")
public interface VoterMapper {
    VoterMapper INSTANCE = Mappers.getMapper(VoterMapper.class);

    @Mapping(source="email", target="email")
    AuthResponse toDto(VoterEntity entity);

    @Mapping(target = "id", ignore = true)
    @Mapping(source="password", target="hashedPassword", qualifiedByName = "encode")
    VoterEntity toEntity(VoterRequest request, @Context PasswordEncoder passwordEncoder);

    @Named("encode")
    default String encodePassword(String rawPassword, @Context PasswordEncoder passwordEncoder) {
        return passwordEncoder.encode(rawPassword);
    }
}
