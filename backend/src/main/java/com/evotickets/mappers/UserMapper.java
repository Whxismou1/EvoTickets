package com.evotickets.mappers;

import org.mapstruct.Mapper;
import org.mapstruct.factory.Mappers;
import com.evotickets.dtos.UserDTO;
import com.evotickets.entities.UserEntity;

@Mapper(componentModel = "spring")
public interface UserMapper {
    UserMapper INSTANCE = Mappers.getMapper(UserMapper.class);

    UserDTO toDTO(UserEntity userEntity);
    UserEntity toEntity(UserDTO userDTO);
}
