/**
 * @jest-environment node
 */
import { GET } from './route';

describe('API pessoas GET', () => {
	const originalFetch = global.fetch;

	beforeEach(() => {
		jest.resetAllMocks();
	});

	afterAll(() => {
		global.fetch = originalFetch as any;
	});

	it('chama a API externa com pagina zero-based e retorna dados mapeados', async () => {
		const abitusResponse = {
			content: [
				{
					id: 1,
					nome: 'JOAO',
					idade: 30,
					sexo: 'MASCULINO',
					vivo: true,
					urlFoto: null,
					ultimaOcorrencia: {
						dtDesaparecimento: '2024-01-05',
						dataLocalizacao: null,
						encontradoVivo: false,
						localDesaparecimentoConcat: 'MT - Cuiabá',
						ocorrenciaEntrevDesapDTO: {
							informacao: 'Detalhes',
							vestimentasDesaparecido: 'Camisa',
						},
						listaCartaz: null,
						ocoId: 100,
					},
				},
			],
			totalElements: 100,
			totalPages: 10,
			pageable: { pageNumber: 1, pageSize: 3 },
			numberOfElements: 3,
			first: false,
			last: false,
			size: 3,
			number: 1,
			sort: { unsorted: true, sorted: false, empty: true },
			empty: false,
		};

		global.fetch = jest.fn().mockResolvedValue({
			ok: true,
			status: 200,
			statusText: 'OK',
			json: async () => abitusResponse,
		}) as any;

		const request = { url: 'http://localhost/api/pessoas?page=2&pageSize=3' } as any;
		const response = await GET(request);

		// Verifica URL e opções usadas no fetch
		expect(global.fetch).toHaveBeenCalledTimes(1);
		const expectedUrl = 'https://abitus-api.geia.vip/v1/pessoas/aberto/filtro?pagina=1&porPagina=3';
		expect((global.fetch as jest.Mock).mock.calls[0][0]).toBe(expectedUrl);
		expect((global.fetch as jest.Mock).mock.calls[0][1]).toEqual({
			method: 'GET',
			headers: { 'Content-Type': 'application/json' },
		});

		// Verifica resposta formatada
		const body = await (response as Response).json();
		expect(body.total).toBe(100);
		expect(body.page).toBe(2);
		expect(body.pageSize).toBe(3);
		expect(Array.isArray(body.data)).toBe(true);
		expect(body.data[0]).toMatchObject({
			id: 1,
			nome: 'JOAO',
			sexo: 'masculino',
			localizado: false,
			dtDesaparecimento: '2024-01-05',
			localDesaparecimentoConcat: 'MT - Cuiabá',
			ultimaOcorrencia: 'Detalhes',
			foto: '',
		});
	});

	it('retorna 500 quando a API externa responde com erro', async () => {
		global.fetch = jest.fn().mockResolvedValue({
			ok: false,
			status: 502,
			statusText: 'Bad Gateway',
		}) as any;

		const request = { url: 'http://localhost/api/pessoas?page=1&pageSize=12' } as any;
		const response = await GET(request);

		expect((response as Response).status).toBe(500);
		const body = await (response as Response).json();
		expect(body).toEqual({ error: 'Erro interno do servidor' });
	});
});


