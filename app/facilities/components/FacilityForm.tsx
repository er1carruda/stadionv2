// app/facilities/components/FacilityForm.tsx
'use client';

import { useActionState } from 'react';
import { createFacility, type FacilityFormState } from '../actions';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';
import { AlertCircle, Loader2 } from 'lucide-react';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

const initialState: FacilityFormState = {};

export function FacilityForm() {
  const [state, formAction, isPending] = useActionState(createFacility, initialState);

  return (
    <form action={formAction} className="space-y-6">

      {/* Campo Nome */}
      <div>
        <Label htmlFor="name">Nome da Instalação</Label>
        <Input id="name" name="name" placeholder="Ex: Ginásio Municipal" required aria-describedby="name-error" />
        {/* Erro Nome */}
        {state?.errors?.name && <p id="name-error" className="text-sm font-medium text-red-600 dark:text-red-400 mt-1"><AlertCircle className="inline w-4 h-4 mr-1" />{state.errors.name.join(', ')}</p>}
      </div>

      {/* Campo Endereço */}
      <div>
        <Label htmlFor="address">Endereço Completo</Label>
        <Input id="address" name="address" placeholder="Rua Exemplo, 123, Bairro, Cidade - SP" required aria-describedby="address-error" />
         {/* Erro Endereço */}
        {state?.errors?.address && <p id="address-error" className="text-sm font-medium text-red-600 dark:text-red-400 mt-1"><AlertCircle className="inline w-4 h-4 mr-1" />{state.errors.address.join(', ')}</p>}
      </div>

       {/* --- DIV PARA TIPO E CAPACIDADE (LADO A LADO EM TELAS MAIORES) --- */}
       <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {/* Campo Tipo */}
            <div>
                <Label htmlFor="type">Tipo</Label>
                <Select name="type" required>
                    <SelectTrigger id="type" aria-describedby="type-error">
                        <SelectValue placeholder="Selecione o tipo" />
                    </SelectTrigger>
                    <SelectContent>
                        <SelectItem value="Quadra">Quadra</SelectItem>
                        <SelectItem value="Ginásio">Ginásio</SelectItem>
                        <SelectItem value="Campo">Campo</SelectItem>
                        <SelectItem value="Piscina">Piscina</SelectItem>
                        <SelectItem value="Pista">Pista</SelectItem>
                        <SelectItem value="Outro">Outro</SelectItem>
                    </SelectContent>
                </Select>
                {/* Erro Tipo */}
                {state?.errors?.type && <p id="type-error" className="text-sm font-medium text-red-600 dark:text-red-400 mt-1"><AlertCircle className="inline w-4 h-4 mr-1" />{state.errors.type.join(', ')}</p>}
            </div>

            {/* --- NOVO CAMPO CAPACIDADE --- */}
            <div>
                <Label htmlFor="capacity">Capacidade (Pessoas)</Label>
                <Input
                    id="capacity"
                    name="capacity"
                    type="number" // Define o tipo como número
                    placeholder="Ex: 100"
                    required
                    min="0" // Opcional: define capacidade mínima
                    aria-describedby="capacity-error"
                />
                 {/* Erro Capacidade */}
                {state?.errors?.capacity && (
                <p id="capacity-error" className="text-sm font-medium text-red-600 dark:text-red-400 mt-1">
                    <AlertCircle className="inline w-4 h-4 mr-1" />
                    {state.errors.capacity.join(', ')}
                </p>
                )}
            </div>
            {/* --- FIM NOVO CAMPO CAPACIDADE --- */}
       </div>
       {/* --- FIM DIV TIPO/CAPACIDADE --- */}


      {/* Campo Descrição */}
      <div>
        <Label htmlFor="description">Descrição (Opcional)</Label>
        <Textarea id="description" name="description" placeholder="Detalhes sobre a instalação..." rows={4} aria-describedby="description-error" />
        {/* Erro Descrição */}
        {state?.errors?.description && <p id="description-error" className="text-sm font-medium text-red-600 dark:text-red-400 mt-1"><AlertCircle className="inline w-4 h-4 mr-1" />{state.errors.description.join(', ')}</p>}
      </div>

      {/* Campos de Contato */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div>
          <Label htmlFor="contact_phone">Telefone de Contato</Label>
          <Input id="contact_phone" name="contact_phone" type="tel" placeholder="(XX) XXXXX-XXXX" aria-describedby="contact_phone-error" />
           {/* Erro Telefone */}
          {state?.errors?.contact_phone && <p id="contact_phone-error" className="text-sm font-medium text-red-600 dark:text-red-400 mt-1"><AlertCircle className="inline w-4 h-4 mr-1" />{state.errors.contact_phone.join(', ')}</p>}
        </div>
        <div>
          <Label htmlFor="contact_email">Email de Contato</Label>
          <Input id="contact_email" name="contact_email" type="email" placeholder="contato@email.com" aria-describedby="contact_email-error" />
          {/* Erro Email */}
          {state?.errors?.contact_email && <p id="contact_email-error" className="text-sm font-medium text-red-600 dark:text-red-400 mt-1"><AlertCircle className="inline w-4 h-4 mr-1" />{state.errors.contact_email.join(', ')}</p>}
        </div>
      </div>

      {/* Campo Horário de Funcionamento */}
       <div>
        <Label htmlFor="operating_hours_info">Informações de Horário (Opcional)</Label>
        <Input id="operating_hours_info" name="operating_hours_info" placeholder="Ex: Seg-Sex: 8h-22h, Sáb: 9h-18h" aria-describedby="operating_hours_info-error" />
         {/* Erro Horário */}
        {state?.errors?.operating_hours_info && <p id="operating_hours_info-error" className="text-sm font-medium text-red-600 dark:text-red-400 mt-1"><AlertCircle className="inline w-4 h-4 mr-1" />{state.errors.operating_hours_info.join(', ')}</p>}
      </div>

      {/* Mensagem de Erro Geral */}
      {state?.message && state.message.startsWith('Erro') && (
         <div className="flex items-center gap-2 p-3 text-sm text-red-700 bg-red-100 dark:bg-red-900/30 dark:text-red-400 border border-red-300 dark:border-red-600/50 rounded-md">
            <AlertCircle className="w-4 h-4" />
            <span>{state.message}</span>
          </div>
      )}

      {/* Botão de Submissão */}
      <Button type="submit" disabled={isPending} className="w-full sm:w-auto">
        {isPending ? (<><Loader2 className="mr-2 h-4 w-4 animate-spin" />Salvando...</>) : ('Criar Instalação')}
      </Button>
    </form>
  );
}