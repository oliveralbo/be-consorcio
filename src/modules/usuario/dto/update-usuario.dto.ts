import { PartialType } from '@nestjs/mapped-types';
import { CreateUsuarioAppDto } from './create-usuario.dto';

export class UpdateUsuarioAppDto extends PartialType(CreateUsuarioAppDto) {
  // PartialType makes all properties of CreateUsuarioAppDto optional.
  // This includes email_login, password, rol, and id_persona.
  // Specific validation rules for updates (e.g., password change logic)
  // can be added here if needed, or handled in the service layer.
}
