package smartpoll.backend.mapper;

import org.mapstruct.*;
import org.mapstruct.factory.Mappers;
import smartpoll.backend.dto.QRReadResponse;
import smartpoll.backend.entity.QRReadEventEntity;

@Mapper(componentModel = "spring")
public interface QRReadMapper {
    QRReadMapper INSTANCE = Mappers.getMapper(QRReadMapper.class);

    @Mapping(source="createdAt", target="createdAt")
    QRReadResponse toDto(QRReadEventEntity entity);
}


