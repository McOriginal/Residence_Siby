import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import api from './api';

// Ajouter une Contrats
export const useCreateContrat = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data) => api.post('/contrats/createContrat', data),
    onSuccess: () => queryClient.invalidateQueries(['contrats']),
  });
};

// Obtenir une Contrat
export const useAllContrat = () =>
  useQuery({
    queryKey: ['contrats'],
    queryFn: () => api.get('/contrats/getAllContrats').then((res) => res.data),
    staleTime: 1000 * 60 * 5, //chaque 5 minutes rafraichir les données
  });

// Obtenir une contrats
export const useOneContrat = (id) =>
  useQuery({
    queryKey: ['contrats', id],
    queryFn: () =>
      api.get(`/contrats/getContrat/${id}`).then((res) => res.data),
    enabled: Boolean(id),
    staleTime: 1000 * 60 * 5, //chaque 5 minutes rafraichir les données
  });

// Mettre à jour une Contrat
export const useUpdateContrat = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, data }) =>
      api.put(`/contrats/updateContrat/${id}`, data),
    onSuccess: () => queryClient.invalidateQueries(['contrats']),
  });
};

// Supprimer une contrats
export const useDeleteContrat = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id) => api.delete(`/contrats/deleteContrat/${id}`),
    onSuccess: () => queryClient.invalidateQueries(['contrats']),
  });
};

// Supprimer toutes les contrats
export const useDeleteAllContrat = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: () => api.delete('/contrats/deleteAllContrat'),
    onSuccess: () => queryClient.invalidateQueries(['contrats']),
  });
};
