'use client';

import { useActionState } from 'react';
import { createInstructor, type InstructorFormState } from '../actions';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';
import { AlertCircle, Loader2, Plus, Trash2 } from 'lucide-react';
import { Checkbox } from '@/components/ui/checkbox';
import { useState } from 'react';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

const dayNames = [
  'Domingo',
  'Segunda-feira',
  'Terça-feira',
  'Quarta-feira',
  'Quinta-feira',
  'Sexta-feira',
  'Sábado'
];

const initialState: InstructorFormState = {};

export function InstructorForm() {
  const [state, formAction, isPending] = useActionState(createInstructor, initialState);
  
  // Estado para serviços
  const [services, setServices] = useState([{ service_name: '', duration_minutes: '', price: '' }]);
  
  // Estado para regras de disponibilidade
  const [availabilityRules, setAvailabilityRules] = useState([
    { day_of_week: '0', start_time: '', end_time: '' }
  ]);
  
  // Adicionar um novo serviço
  const addService = () => {
    setServices([...services, { service_name: '', duration_minutes: '', price: '' }]);
  };
  
  // Remover um serviço
  const removeService = (index: number) => {
    const updatedServices = [...services];
    updatedServices.splice(index, 1);
    setServices(updatedServices);
  };
  
  // Atualizar um serviço
  const updateService = (index: number, field: string, value: string) => {
    const updatedServices = [...services];
    updatedServices[index] = { ...updatedServices[index], [field]: value };
    setServices(updatedServices);
  };
  
  // Adicionar uma nova regra de disponibilidade
  const addAvailabilityRule = () => {
    setAvailabilityRules([...availabilityRules, { day_of_week: '0', start_time: '', end_time: '' }]);
  };
  
  // Remover uma regra de disponibilidade
  const removeAvailabilityRule = (index: number) => {
    const updatedRules = [...availabilityRules];
    updatedRules.splice(index, 1);
    setAvailabilityRules(updatedRules);
  };
  
  // Atualizar uma regra de disponibilidade
  const updateAvailabilityRule = (index: number, field: string, value: string) => {
    const updatedRules = [...availabilityRules];
    updatedRules[index] = { ...updatedRules[index], [field]: value };
    setAvailabilityRules(updatedRules);
  };

  return (
    <form action={formAction} className="space-y-8">
      {/* Mensagem de erro global */}
      {state?.message && (
        <div className="p-4 border border-red-300 bg-red-50 text-red-800 rounded-md mb-6">
          <div className="flex items-start">
            <AlertCircle className="w-5 h-5 mr-2 mt-0.5 text-red-600" />
            <div className="flex-1">
              <p className="font-medium">{state.message}</p>
              {state.message.includes('Erro de segurança') && (
                <div className="mt-2 text-sm text-red-700">
                  <p>Erro de permissão detectado. A aplicação não conseguiu criar seu perfil de instrutor devido a restrições de segurança.</p>
                  <p className="mt-1">Isto geralmente acontece quando:</p>
                  <ul className="list-disc pl-5 mt-1 space-y-1">
                    <li>Seu papel de usuário no sistema não está configurado exatamente como &quot;instructor&quot;</li>
                    <li>Houve um problema de sincronização na atualização de seu papel de usuário</li>
                  </ul>
                  <p className="mt-2">Por favor, tente novamente ou contate o suporte se o problema persistir.</p>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
      
      {/* Informações básicas - Seção 1 */}
      <div className="space-y-6">
        <h2 className="text-xl font-semibold">Informações Básicas</h2>
        
        {/* Campo Especialidade */}
        <div>
          <Label htmlFor="specialty">Especialidade</Label>
          <Input 
            id="specialty" 
            name="specialty" 
            placeholder="Ex: Treinamento Funcional, Musculação, Yoga..." 
            required 
            aria-describedby="specialty-error" 
          />
          {/* Erro Especialidade */}
          {state?.errors?.specialty && (
            <p id="specialty-error" className="text-sm font-medium text-red-600 dark:text-red-400 mt-1">
              <AlertCircle className="inline w-4 h-4 mr-1" />
              {state.errors.specialty.join(', ')}
            </p>
          )}
        </div>

        {/* Campo URL da Foto de Perfil */}
        <div>
          <Label htmlFor="profile_pic_url">URL da Foto de Perfil (opcional)</Label>
          <Input 
            id="profile_pic_url" 
            name="profile_pic_url" 
            type="url"
            placeholder="https://exemplo.com/sua-foto.jpg"
            aria-describedby="profile_pic_url-error" 
          />
          {/* Erro URL de Foto */}
          {state?.errors?.profile_pic_url && (
            <p id="profile_pic_url-error" className="text-sm font-medium text-red-600 dark:text-red-400 mt-1">
              <AlertCircle className="inline w-4 h-4 mr-1" />
              {state.errors.profile_pic_url.join(', ')}
            </p>
          )}
        </div>

        {/* Campo Disponibilidade */}
        <div className="flex items-center space-x-2">
          <Checkbox id="is_available" name="is_available" value="true" defaultChecked />
          <Label htmlFor="is_available">Disponível para agendar aulas</Label>
        </div>

        {/* Campo Biografia */}
        <div>
          <Label htmlFor="bio">Biografia</Label>
          <Textarea 
            id="bio" 
            name="bio" 
            placeholder="Compartilhe sua experiência, filosofia de treinamento e abordagem com seus alunos..."
            rows={4} 
            aria-describedby="bio-error" 
          />
          {/* Erro Biografia */}
          {state?.errors?.bio && (
            <p id="bio-error" className="text-sm font-medium text-red-600 dark:text-red-400 mt-1">
              <AlertCircle className="inline w-4 h-4 mr-1" />
              {state.errors.bio.join(', ')}
            </p>
          )}
        </div>
      </div>

      {/* Serviços oferecidos - Seção 2 */}
      <div className="space-y-6 border-t pt-6">
        <h2 className="text-xl font-semibold">Serviços Oferecidos</h2>
        
        {/* Contador de serviços (hidden) */}
        <input type="hidden" name="services_count" value={services.length} />
        
        {/* Lista de serviços */}
        {services.map((service, index) => (
          <div key={index} className="p-4 border rounded-md space-y-4">
            <div className="flex justify-between items-center">
              <h3 className="font-medium">Serviço #{index + 1}</h3>
              {services.length > 1 && (
                <Button 
                  type="button" 
                  variant="ghost" 
                  size="icon" 
                  onClick={() => removeService(index)}
                  aria-label="Remover serviço"
                >
                  <Trash2 className="h-4 w-4 text-red-500" />
                </Button>
              )}
            </div>
            
            <div className="grid gap-4 grid-cols-1 md:grid-cols-3">
              <div>
                <Label htmlFor={`services[${index}].service_name`}>Nome do Serviço</Label>
                <Input
                  id={`services[${index}].service_name`}
                  name={`services[${index}].service_name`}
                  placeholder="Ex: Aula de Pilates"
                  value={service.service_name}
                  onChange={(e) => updateService(index, 'service_name', e.target.value)}
                  required
                />
              </div>
              <div>
                <Label htmlFor={`services[${index}].duration_minutes`}>Duração (minutos)</Label>
                <Input
                  id={`services[${index}].duration_minutes`}
                  name={`services[${index}].duration_minutes`}
                  type="number"
                  min="15"
                  step="5"
                  placeholder="60"
                  value={service.duration_minutes}
                  onChange={(e) => updateService(index, 'duration_minutes', e.target.value)}
                  required
                />
              </div>
              <div>
                <Label htmlFor={`services[${index}].price`}>Preço (R$)</Label>
                <Input
                  id={`services[${index}].price`}
                  name={`services[${index}].price`}
                  type="number"
                  min="0"
                  step="0.01"
                  placeholder="100.00"
                  value={service.price}
                  onChange={(e) => updateService(index, 'price', e.target.value)}
                  required
                />
              </div>
            </div>
          </div>
        ))}
        
        {/* Botão para adicionar novo serviço */}
        <Button 
          type="button" 
          variant="outline" 
          onClick={addService} 
          className="w-full"
        >
          <Plus className="h-4 w-4 mr-2" /> Adicionar Serviço
        </Button>
        
        {/* Erro nos serviços */}
        {state?.errors?.services && (
          <p className="text-sm font-medium text-red-600 dark:text-red-400 mt-1">
            <AlertCircle className="inline w-4 h-4 mr-1" />
            {state.errors.services.join(', ')}
          </p>
        )}
      </div>

      {/* Disponibilidade - Seção 3 */}
      <div className="space-y-6 border-t pt-6">
        <h2 className="text-xl font-semibold">Disponibilidade Semanal</h2>
        
        {/* Contador de regras de disponibilidade (hidden) */}
        <input type="hidden" name="availability_count" value={availabilityRules.length} />
        
        {/* Lista de regras de disponibilidade */}
        {availabilityRules.map((rule, index) => (
          <div key={index} className="p-4 border rounded-md space-y-4">
            <div className="flex justify-between items-center">
              <h3 className="font-medium">Horário Disponível #{index + 1}</h3>
              {availabilityRules.length > 1 && (
                <Button 
                  type="button" 
                  variant="ghost" 
                  size="icon" 
                  onClick={() => removeAvailabilityRule(index)}
                  aria-label="Remover horário"
                >
                  <Trash2 className="h-4 w-4 text-red-500" />
                </Button>
              )}
            </div>
            
            <div className="grid gap-4 grid-cols-1 md:grid-cols-3">
              <div>
                <Label htmlFor={`availability[${index}].day_of_week`}>Dia da Semana</Label>
                <Select 
                  name={`availability[${index}].day_of_week`} 
                  value={rule.day_of_week}
                  onValueChange={(value) => updateAvailabilityRule(index, 'day_of_week', value)}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Selecione o dia" />
                  </SelectTrigger>
                  <SelectContent>
                    {dayNames.map((day, i) => (
                      <SelectItem key={i} value={i.toString()}>{day}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label htmlFor={`availability[${index}].start_time`}>Hora de Início</Label>
                <Input
                  id={`availability[${index}].start_time`}
                  name={`availability[${index}].start_time`}
                  type="time"
                  value={rule.start_time}
                  onChange={(e) => updateAvailabilityRule(index, 'start_time', e.target.value)}
                  required
                />
              </div>
              <div>
                <Label htmlFor={`availability[${index}].end_time`}>Hora de Término</Label>
                <Input
                  id={`availability[${index}].end_time`}
                  name={`availability[${index}].end_time`}
                  type="time"
                  value={rule.end_time}
                  onChange={(e) => updateAvailabilityRule(index, 'end_time', e.target.value)}
                  required
                />
              </div>
            </div>
          </div>
        ))}
        
        {/* Botão para adicionar nova regra de disponibilidade */}
        <Button 
          type="button" 
          variant="outline" 
          onClick={addAvailabilityRule} 
          className="w-full"
        >
          <Plus className="h-4 w-4 mr-2" /> Adicionar Horário Disponível
        </Button>
        
        {/* Erro na disponibilidade */}
        {state?.errors?.availability_rules && (
          <p className="text-sm font-medium text-red-600 dark:text-red-400 mt-1">
            <AlertCircle className="inline w-4 h-4 mr-1" />
            {state.errors.availability_rules.join(', ')}
          </p>
        )}
      </div>

      {/* Mensagem de Erro Geral */}
      {state?.message && state.message.startsWith('Erro') && (
        <div className="flex items-center gap-2 p-3 text-sm text-red-700 bg-red-100 dark:bg-red-900/30 dark:text-red-400 border border-red-300 dark:border-red-600/50 rounded-md">
          <AlertCircle className="w-4 h-4" />
          <span>{state.message}</span>
        </div>
      )}

      {/* Botão de Submissão */}
      <Button type="submit" disabled={isPending} className="w-full md:w-auto">
        {isPending ? 
          (<><Loader2 className="mr-2 h-4 w-4 animate-spin" />Salvando...</>) : 
          ('Criar Perfil de Instrutor')}
      </Button>
    </form>
  );
} 