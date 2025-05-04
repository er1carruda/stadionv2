// app/facilities/components/FacilityForm.tsx
'use client';

import { useFormState, useFormStatus } from 'react-dom';
import { createFacility, FacilityFormState } from '@/app/facilities/actions';
import { Button } from '@/components/ui/button'; // Import de shadcn/ui
import { Input } from '@/components/ui/input';   // Import de shadcn/ui
import { Label } from '@/components/ui/label';   // Import de shadcn/ui
import { Textarea } from '@/components/ui/textarea'; // Import de shadcn/ui

function SubmitButton() {
  const { pending } = useFormStatus();

  return (
    // Usando a variante outline para um estilo mais "clean"
    <Button type="submit" disabled={pending} aria-disabled={pending} variant="outline">
      {pending ? 'Criando...' : 'Criar Instalação'}
    </Button>
  );
}

export function FacilityForm() {
  const initialState: FacilityFormState = { message: null, errors: {} };
  const [state, dispatch] = useFormState(createFacility, initialState);

  return (
    <form action={dispatch} className="space-y-6">
      {/* Campo Nome */}
      <div className="space-y-2">
        <Label htmlFor="name">Nome da Instalação</Label>
        <Input
          id="name"
          name="name"
          required
          minLength={3}
          aria-describedby="name-error"
          // shadcn/ui Input já tem boa estilização base
        />
        <div id="name-error" aria-live="polite" aria-atomic="true">
          {state.errors?.name &&
            state.errors.name.map((error: string) => (
              <p className="mt-1 text-sm text-red-500" key={error}>
                {error}
              </p>
            ))}
        </div>
      </div>

      {/* Campo Endereço */}
      <div className="space-y-2">
        <Label htmlFor="address">Endereço</Label>
        <Input
          id="address"
          name="address"
          required
          minLength={5}
          aria-describedby="address-error"
        />
        <div id="address-error" aria-live="polite" aria-atomic="true">
          {state.errors?.address &&
            state.errors.address.map((error: string) => (
              <p className="mt-1 text-sm text-red-500" key={error}>
                {error}
              </p>
            ))}
        </div>
      </div>

       {/* Campo Tipo */}
       <div className="space-y-2">
        <Label htmlFor="type">Tipo (Ex: Quadra Poliesportiva, Campo Society)</Label>
        <Input
          id="type"
          name="type"
          required
          minLength={3}
          aria-describedby="type-error"
        />
        <div id="type-error" aria-live="polite" aria-atomic="true">
          {state.errors?.type &&
            state.errors.type.map((error: string) => (
              <p className="mt-1 text-sm text-red-500" key={error}>
                {error}
              </p>
            ))}
        </div>
      </div>

       {/* Campo Capacidade (Opcional) */}
       <div className="space-y-2">
        <Label htmlFor="capacity">Capacidade (Opcional)</Label>
        <Input
          id="capacity"
          name="capacity"
          type="number"
          min="1"
          aria-describedby="capacity-error"
        />
        <div id="capacity-error" aria-live="polite" aria-atomic="true">
          {state.errors?.capacity &&
            state.errors.capacity.map((error: string) => (
              <p className="mt-1 text-sm text-red-500" key={error}>
                {error}
              </p>
            ))}
        </div>
      </div>

      {/* Campo Descrição (Opcional) */}
      <div className="space-y-2">
        <Label htmlFor="description">Descrição (Opcional)</Label>
        <Textarea
          id="description"
          name="description"
          rows={4}
          aria-describedby="description-error"
          // shadcn/ui Textarea já tem boa estilização base
        />
         <div id="description-error" aria-live="polite" aria-atomic="true">
          {state.errors?.description &&
            state.errors.description.map((error: string) => (
              <p className="mt-1 text-sm text-red-500" key={error}>
                {error}
              </p>
            ))}
        </div>
      </div>

      {/* Botão de Submit */}
      <SubmitButton />

      {/* Mensagem geral de erro/sucesso */}
      {state.message && (
         <div aria-live="polite" aria-atomic="true">
            <p className="mt-2 text-sm text-red-500">{state.message}</p>
         </div>
      )}
    </form>
  );
}