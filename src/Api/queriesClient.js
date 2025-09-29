import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import api from './api';

// Ajouter une Fournisseur
export const useCreateClient = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data) => api.post('/clients/createClient', data),
    onSuccess: () => queryClient.invalidateQueries(['clients']),
  });
};

// Obtenir une Client
export const useAllClient = () =>
  useQuery({
    queryKey: ['fournisseur'],
    queryFn: () =>
      api.get('/clients/getAllClients').then((res) => res.data),
    staleTime: 1000 * 60 * 5, //chaque 5 minutes rafraichir les données
  });

// Obtenir une Fournisseur
export const useOneClient = (id) =>
  useQuery({
    queryKey: ['fournisseur', id],
    queryFn: () =>
      api.get(`/clients/getClient/${id}`).then((res) => res.data),
    enabled: Boolean(id),
    staleTime: 1000 * 60 * 5, //chaque 5 minutes rafraichir les données
  });

// Mettre à jour une Client
export const useUpdateClient= () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, data }) =>
      api.put(`/clients/updateClient/${id}`, data),
    onSuccess: () => queryClient.invalidateQueries(['clients']),
  });
};

// Supprimer une Fournisseur
export const useDeleteClient = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id) => api.delete(`/clients/deleteClient/${id}`),
    onSuccess: () => queryClient.invalidateQueries(['clients']),
  });
};

// Supprimer toutes les clients
export const useDeleteAllClient = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: () => api.delete('/clients/deleteAllClients'),
    onSuccess: () => queryClient.invalidateQueries(['clients']),
  });
};
