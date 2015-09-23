--
-- PostgreSQL database dump
--

-- Dumped from database version 9.4.4
-- Dumped by pg_dump version 9.4.0
-- Started on 2015-09-22 19:07:43 COT

SET statement_timeout = 0;
SET lock_timeout = 0;
SET client_encoding = 'UTF8';
SET standard_conforming_strings = on;
SET check_function_bodies = false;
SET client_min_messages = warning;

SET search_path = public, pg_catalog;

SET default_tablespace = '';

SET default_with_oids = false;

--
-- TOC entry 185 (class 1259 OID 17697)
-- Name: estaciones; Type: TABLE; Schema: public; Owner: postgres; Tablespace: 
--

CREATE TABLE estaciones (
    id integer NOT NULL,
    numor character varying(29) NOT NULL,
    numtm character varying(29) NOT NULL,
    estacion character varying(29) NOT NULL,
    troncal character varying(19) NOT NULL,
    zona character varying(19) NOT NULL,
    fase character varying(8) NOT NULL
);


ALTER TABLE estaciones OWNER TO postgres;

--
-- TOC entry 3491 (class 0 OID 17697)
-- Dependencies: 185
-- Data for Name: estaciones; Type: TABLE DATA; Schema: public; Owner: postgres
--

INSERT INTO estaciones VALUES (1, '20124', '9000', 'Portal Usme', 'Caracas Sur', 'Sur', 'FASE I');
INSERT INTO estaciones VALUES (2, '20145', '8000', 'Portal Tunal', 'Tunal', 'Sur', 'FASE I');
INSERT INTO estaciones VALUES (3, '20154', '8001', 'Parque', 'Tunal', 'Sur', 'FASE I');
INSERT INTO estaciones VALUES (4, '20163', '9002', 'Consuelo', 'Caracas Sur', 'Sur', 'FASE I');
INSERT INTO estaciones VALUES (5, '20165', '9003', 'Socorro', 'Caracas Sur', 'Sur', 'FASE I');
INSERT INTO estaciones VALUES (6, '20167', '9001', 'Molinos', 'Caracas Sur', 'Sur', 'FASE I');
INSERT INTO estaciones VALUES (7, '20175', '8002', 'Biblioteca', 'Tunal', 'Sur', 'FASE I');
INSERT INTO estaciones VALUES (8, '20179', '9004', 'Santa Luc�a', 'Caracas Sur', 'Sur', 'FASE I');
INSERT INTO estaciones VALUES (9, '20243', '9100', 'Cl. 40S', 'Caracas Sur', 'Sur', 'FASE I');
INSERT INTO estaciones VALUES (10, '20246', '9101', 'Quiroga', 'Caracas Sur', 'Sur', 'FASE I');
INSERT INTO estaciones VALUES (11, '20257', '9103', 'Olaya', 'Caracas Sur', 'Sur', 'FASE I');
INSERT INTO estaciones VALUES (12, '20262', '9104', 'Restrepo', 'Caracas Sur', 'Sur', 'FASE I');
INSERT INTO estaciones VALUES (13, '20267', '10000', 'Portal 20 de Julio', 'Carrera 10', 'Carrera 10 Sur', 'FASE III');
INSERT INTO estaciones VALUES (14, '20286', '10001', 'Country Sur', 'Carrera 10', 'Carrera 10 Sur', 'FASE III');
INSERT INTO estaciones VALUES (15, '20291', '10002', 'Av. Primero de Mayo', 'Carrera 10', 'Carrera 10 Sur', 'FASE III');
INSERT INTO estaciones VALUES (16, '20293', '9105', 'Fucha', 'Caracas Sur', 'Caracas sur', 'FASE I');
INSERT INTO estaciones VALUES (17, '20300', '10003', 'Ciudad Jard�n', 'Carrera 10', 'Carrera 10 Sur', 'FASE III');
INSERT INTO estaciones VALUES (18, '20307', '10004', 'Policarpa', 'Carrera 10', 'Carrera 10 Sur', 'FASE III');
INSERT INTO estaciones VALUES (19, '20319', '7507', 'Estaci�n Salida Bosa Soacha', 'Soacha', 'Soacha', 'SOACHA');
INSERT INTO estaciones VALUES (20, '20325', '7000', 'Portal Sur', 'NQS', 'NQS 4', 'FASE II');
INSERT INTO estaciones VALUES (21, '20345', '7001', 'Perdomo', 'NQS', 'NQS 4', 'FASE II');
INSERT INTO estaciones VALUES (22, '20348', '7002', 'Madelena', 'NQS', 'NQS 4', 'FASE II');
INSERT INTO estaciones VALUES (23, '20385', '5000', 'Portal Am�ricas', 'Americas - Calle 13', 'Americas 1', 'FASE II');
INSERT INTO estaciones VALUES (24, '20424', '5001', 'Patio Bonito', 'Americas - Calle 13', 'Americas 1', 'FASE II');
INSERT INTO estaciones VALUES (25, '20432', '5002', 'Biblioteca Tintal', 'Americas - Calle 13', 'Americas 1', 'FASE II');
INSERT INTO estaciones VALUES (26, '20435', '5005', 'Tv. 86', 'Americas - Calle 13', 'Americas 1', 'FASE II');
INSERT INTO estaciones VALUES (27, '20443', '7003', 'Sevillana', 'NQS', 'NQS 4', 'FASE II');
INSERT INTO estaciones VALUES (28, '20449', '7004', 'Venecia', 'NQS', 'NQS 4', 'FASE II');
INSERT INTO estaciones VALUES (29, '20452', '7005', 'Alqueria', 'NQS', 'NQS 4', 'FASE II');
INSERT INTO estaciones VALUES (30, '20475', '7006', 'General Santander', 'NQS', 'NQS 4', 'FASE II');
INSERT INTO estaciones VALUES (31, '20482', '7007', 'NQS - Cl. 38A S', 'NQS', 'NQS 4', 'FASE II');
INSERT INTO estaciones VALUES (32, '20504', '5100', 'Banderas', 'Americas - Calle 13', 'Americas 1', 'FASE II');
INSERT INTO estaciones VALUES (33, '20518', '5101', 'Mandalay', 'Americas - Calle 13', 'Americas 1', 'FASE II');
INSERT INTO estaciones VALUES (34, '20519', '5102', 'Mundo Aventura', 'Americas - Calle 13', 'Americas 1', 'FASE II');
INSERT INTO estaciones VALUES (35, '20536', '5103', 'Marsella', 'Americas - Calle 13', 'Americas 1', 'FASE II');
INSERT INTO estaciones VALUES (36, '20544', '5105', 'Pradera', 'Americas - Calle 13', 'Americas 2', 'FASE II');
INSERT INTO estaciones VALUES (37, '20617', '6500', 'Aeropuerto', 'Calle 26', 'Calle 26 Occidental', 'FASE III');
INSERT INTO estaciones VALUES (38, '20617', '6000', 'Portal Eldorado', 'Calle 26', 'Calle 26 Occidental', 'FASE III');
INSERT INTO estaciones VALUES (39, '20676', '7008', 'NQS - Cl. 30 S', 'NQS', 'NQS 4', 'FASE II');
INSERT INTO estaciones VALUES (40, '20681', '7009', 'SENA', 'NQS', 'NQS 4', 'FASE II');
INSERT INTO estaciones VALUES (41, '20697', '7113', 'Santa Isabel', 'NQS', 'NQS 4', 'FASE II');
INSERT INTO estaciones VALUES (42, '20704', '9106', 'Nari�o', 'Caracas Sur', 'Caracas sur', 'FASE I');
INSERT INTO estaciones VALUES (43, '20716', '9107', 'Hort�a', 'Caracas Sur', 'Caracas sur', 'FASE I');
INSERT INTO estaciones VALUES (44, '20723', '9108', 'Hospital', 'Caracas Sur', 'Caracas sur', 'FASE I');
INSERT INTO estaciones VALUES (45, '20725', '13002', 'Calle 6  -Cra. 20', 'Calle 6', 'Calle 6', 'FASE III');
INSERT INTO estaciones VALUES (46, '20730', '7112', 'Comuneros', 'NQS', 'NQS 4', 'FASE II');
INSERT INTO estaciones VALUES (47, '20732', '13003', 'Calle 6  -Cra. 24', 'Calle 6', 'Calle 6', 'FASE III');
INSERT INTO estaciones VALUES (48, '20735', '12003', 'Ricaurte', 'Americas - Calle 13', 'NQS 2', 'FASE II');
INSERT INTO estaciones VALUES (49, '20737', '7111', 'Ricaurte NQS', 'NQS', 'NQS 3', 'FASE II');
INSERT INTO estaciones VALUES (50, '20741', '12004', 'San Facon - Cr. 22', 'Americas - Calle 13', 'Calle13', 'FASE II');
INSERT INTO estaciones VALUES (51, '20754', '5107', 'Am�ricas - Cr. 53A', 'Americas - Calle 13', 'Americas 2', 'FASE II');
INSERT INTO estaciones VALUES (52, '20759', '12000', 'Puente Aranda', 'Americas - Calle 13', 'Calle13', 'FASE II');
INSERT INTO estaciones VALUES (53, '20777', '12001', 'Carrera 43', 'Americas - Calle 13', 'Am�ricas', 'FASE II');
INSERT INTO estaciones VALUES (54, '20778', '12007', 'Zona Industrial', 'Americas - Calle 13', 'Calle13', 'FASE II');
INSERT INTO estaciones VALUES (55, '20780', '12002', 'CDS - Cr. 32', 'Americas - Calle 13', 'Calle13', 'FASE II');
INSERT INTO estaciones VALUES (56, '20795', '7110', 'Paloquemao', 'NQS', 'NQS 3', 'FASE II');
INSERT INTO estaciones VALUES (57, '20807', '6106', 'Corferias', 'Calle 26', 'Calle 26 Oriental', 'FASE III');
INSERT INTO estaciones VALUES (58, '20811', '6104', 'Gobernaci�n', 'Calle 26', 'Calle 26 Oriental', 'FASE III');
INSERT INTO estaciones VALUES (59, '20812', '6103', 'CAN', 'Calle 26', 'Calle 26 Oriental', 'FASE III');
INSERT INTO estaciones VALUES (60, '20815', '6105', 'Quinta Paredes', 'Calle 26', 'Calle 26 Oriental', 'FASE III');
INSERT INTO estaciones VALUES (61, '20822', '10010', 'Hospitales', 'Carrera 10', 'Carrera 10 Sur', 'FASE III');
INSERT INTO estaciones VALUES (62, '20831', '10005', 'Bicentenario', 'Carrera 10', 'Carrera 10 centro', 'FASE III');
INSERT INTO estaciones VALUES (63, '20832', '9109', 'Tercer Milenio', 'Caracas', 'Centro', 'FASE I');
INSERT INTO estaciones VALUES (64, '20859', '14001', 'De La Sabana', 'Americas - Calle 13', 'Eje ambiental', 'FASE II');
INSERT INTO estaciones VALUES (65, '20861', '9110', 'Av. Jim�nez', 'Caracas', 'Eje ambiental', 'FASE I');
INSERT INTO estaciones VALUES (66, '20862', '14003', 'San Victorino', 'Eje ambiental', 'Eje ambiental', 'FASE I');
INSERT INTO estaciones VALUES (67, '20876', '10006', 'San Victorino', 'Carrera 10', 'Carrera 10 centro', 'FASE III');
INSERT INTO estaciones VALUES (68, '20878', '14004', 'Museo del Oro', 'Eje ambiental', 'Eje ambiental', 'FASE I');
INSERT INTO estaciones VALUES (69, '20879', '9111', 'Cl. 19', 'Caracas', 'Centro', 'FASE I');
INSERT INTO estaciones VALUES (70, '20883', '10007', 'Las Nieves', 'Carrera 10', 'Carrera 10 centro', 'FASE III');
INSERT INTO estaciones VALUES (71, '20887', '9113', 'Calle  22', 'Caracas', 'Centro', 'FASE I');
INSERT INTO estaciones VALUES (72, '20888', '9114', 'Calle 26', 'Caracas', 'Centro', 'FASE I');
INSERT INTO estaciones VALUES (73, '20889', '10008', 'San Diego', 'Carrera 10', 'Carrera 10 centro', 'FASE III');
INSERT INTO estaciones VALUES (74, '20890', '6110', 'Estaci�n Central', 'Calle 26', 'Carrera 10 centro', 'FASE III');
INSERT INTO estaciones VALUES (75, '20896', '14005', 'Las Aguas', 'Eje ambiental', 'Eje ambiental', 'FASE I');
INSERT INTO estaciones VALUES (76, '20901', '6111', 'Universidades', 'Calle 26', 'Calle 26 Oriental', 'FASE III');
INSERT INTO estaciones VALUES (77, '20908', '10009', 'Museo Nacional', 'Carrera 10', 'Carrera 10 centro', 'FASE III');
INSERT INTO estaciones VALUES (78, '20915', '7109', 'CAD', 'NQS', 'NQS 3', 'FASE II');
INSERT INTO estaciones VALUES (79, '20919', '6109', 'Centro Memoria', 'Calle 26', 'Calle 26 Oriental', 'FASE III');
INSERT INTO estaciones VALUES (80, '20920', '6108', 'Plaza de la Democracia', 'Calle 26', 'Calle 26 Oriental', 'FASE III');
INSERT INTO estaciones VALUES (81, '20921', '6107', 'Ciudad Universitaria', 'Calle 26', 'Calle 26 Oriental', 'FASE III');
INSERT INTO estaciones VALUES (82, '20923', '7108', 'Av. El Dorado', 'NQS', 'NQS 3', 'FASE II');
INSERT INTO estaciones VALUES (83, '20940', '9115', 'Profamilia', 'Caracas', 'Caracas centro', 'FASE I');
INSERT INTO estaciones VALUES (84, '20948', '7107', 'U. Nacional', 'NQS', 'NQS 2', 'FASE II');
INSERT INTO estaciones VALUES (85, '20954', '7106', 'El Camp�n', 'NQS', 'NQS 1', 'FASE II');
INSERT INTO estaciones VALUES (86, '20971', '1020', 'Calle 36 - Carrera 7', 'Carrera 7', 'Carrera 7 Norte', 'FASE III');
INSERT INTO estaciones VALUES (87, '20973', '9116', 'Av. 39', 'Caracas', 'Caracas centro', 'FASE I');
INSERT INTO estaciones VALUES (88, '20977', '9117', 'Cl. 45', 'Caracas', 'Chapinero', 'FASE I');
INSERT INTO estaciones VALUES (89, '20979', '1019', 'Calle 45 - Carrera 7', 'Carrera 7', 'Carrera 7 Norte', 'FASE III');
INSERT INTO estaciones VALUES (90, '20988', '9118', 'Marly', 'Caracas', 'Chapinero', 'FASE I');
INSERT INTO estaciones VALUES (91, '20992', '9119', 'Cl. 57', 'Caracas', 'Chapinero', 'FASE I');
INSERT INTO estaciones VALUES (92, '20998', '9120', 'Cl. 63', 'Caracas', 'Chapinero', 'FASE I');
INSERT INTO estaciones VALUES (93, '20999', '1017', 'Calle 60 - Cra. 7', 'Carrera 7', 'Carrera 7 Norte', 'FASE III');
INSERT INTO estaciones VALUES (94, '21019', '6102', 'Salitre El Greco', 'Calle 26', 'Calle 26 Occidental', 'FASE III');
INSERT INTO estaciones VALUES (95, '21020', '6100', 'Av. Rojas', 'Calle 26', 'Calle 26 Occidental', 'FASE III');
INSERT INTO estaciones VALUES (96, '21023', '6001', 'Modelia', 'Calle 26', 'Calle 26 Occidental', 'FASE III');
INSERT INTO estaciones VALUES (97, '21024', '6002', 'Normand�a', 'Calle 26', 'Calle 26 Occidental', 'FASE III');
INSERT INTO estaciones VALUES (98, '21091', '4000', 'Portal 80', 'Calle 80', 'Calle80 1', 'FASE I');
INSERT INTO estaciones VALUES (99, '21092', '4001', 'Quirigua', 'Calle 80', 'Calle80 1', 'FASE I');
INSERT INTO estaciones VALUES (100, '21093', '4002', 'Carrera 90', 'Calle 80', 'Calle80 1', 'FASE I');
INSERT INTO estaciones VALUES (101, '21107', '6101', 'El Tiempo', 'Calle 26', 'Calle 26', 'FASE III');
INSERT INTO estaciones VALUES (102, '21110', '4100', 'Cr. 77', 'Calle 80', 'Calle80 1', 'FASE I');
INSERT INTO estaciones VALUES (103, '21114', '4101', 'Minuto de Dios', 'Calle 80', 'Calle80 1', 'FASE I');
INSERT INTO estaciones VALUES (104, '21117', '4102', 'Boyac�', 'Calle 80', 'Calle80 1', 'FASE I');
INSERT INTO estaciones VALUES (105, '21120', '4003', 'Av. Cali', 'Calle 80', 'Calle80 1', 'FASE I');
INSERT INTO estaciones VALUES (106, '21123', '4004', 'Granja', 'Calle 80', 'Calle80 1', 'FASE I');
INSERT INTO estaciones VALUES (107, '21141', '7105', 'Coliseo', 'NQS', 'NQS 1', 'FASE II');
INSERT INTO estaciones VALUES (108, '21143', '7104', 'Sim�n Bolivar', 'NQS', 'NQS 1', 'FASE II');
INSERT INTO estaciones VALUES (109, '21164', '4105', 'Cr. 53', 'Calle 80', 'Calle80 2', 'FASE I');
INSERT INTO estaciones VALUES (110, '21166', '7103', 'Av. Chile', 'NQS', 'NQS 1', 'FASE II');
INSERT INTO estaciones VALUES (111, '21171', '4106', 'Cr. 47', 'Calle 80', 'Calle80 2', 'FASE I');
INSERT INTO estaciones VALUES (112, '21185', '9121', 'Flores', 'Caracas', 'Chapinero', 'FASE I');
INSERT INTO estaciones VALUES (113, '21191', '9122', 'Cl. 72', 'Caracas', 'Caracas norte', 'FASE I');
INSERT INTO estaciones VALUES (114, '21197', '9123', 'Cl. 76', 'Caracas', 'Caracas norte', 'FASE I');
INSERT INTO estaciones VALUES (115, '21198', '2304', 'H�roes', 'AutoNorte', 'Norte 4', 'FASE I');
INSERT INTO estaciones VALUES (116, '21200', '1016', 'Calle 67 - Cra. 7', 'Carrera 7', 'Carrera 7 Norte', 'FASE III');
INSERT INTO estaciones VALUES (117, '21206', '1015', 'Calle 72 - Cra. 7', 'Carrera 7', 'Carrera 7 Norte', 'FASE III');
INSERT INTO estaciones VALUES (118, '21215', '7102', 'NQS - Cl. 75', 'NQS', 'NQS 1', 'FASE II');
INSERT INTO estaciones VALUES (119, '21216', '4107', 'Escuela Militar', 'Calle 80', 'Calle80 3', 'FASE I');
INSERT INTO estaciones VALUES (120, '21217', '3014', 'San Mart�n', 'Suba', 'Suba 2', 'FASE II');
INSERT INTO estaciones VALUES (121, '21221', '4108', 'Polo', 'Calle 80', 'Calle80 3', 'FASE I');
INSERT INTO estaciones VALUES (122, '21223', '3013', 'Rionegro', 'Suba', 'Suba 2', 'FASE II');
INSERT INTO estaciones VALUES (123, '21225', '7101', 'La Castellana', 'NQS', 'NQS 1', 'FASE II');
INSERT INTO estaciones VALUES (124, '21227', '2303', 'Cl. 85', 'AutoNorte', 'Norte 4', 'FASE I');
INSERT INTO estaciones VALUES (125, '21231', '2302', 'Virrey', 'AutoNorte', 'Norte 4', 'FASE I');
INSERT INTO estaciones VALUES (126, '21233', '2300', 'Cl. 100', 'AutoNorte', 'Norte 3', 'FASE I');
INSERT INTO estaciones VALUES (127, '21238', '4103', 'Ferias', 'Calle 80', 'Calle80 2', 'FASE I');
INSERT INTO estaciones VALUES (128, '21241', '4104', 'Av. 68', 'Calle 80', 'Calle80 2', 'FASE I');
INSERT INTO estaciones VALUES (129, '21251', '3009', 'Shaio', 'Suba', 'Suba 2', 'FASE II');
INSERT INTO estaciones VALUES (130, '21255', '3007', 'Humedal C�rdoba', 'Suba', 'Suba 2', 'FASE II');
INSERT INTO estaciones VALUES (131, '21258', '3006', 'Niza - Cl. 127', 'Suba', 'Suba 2', 'FASE II');
INSERT INTO estaciones VALUES (132, '21262', '3011', 'Suba - Cl. 100', 'Suba', 'Suba 2', 'FASE II');
INSERT INTO estaciones VALUES (133, '21267', '3010', 'Puentelargo', 'Suba', 'Suba 2', 'FASE II');
INSERT INTO estaciones VALUES (134, '21271', '2205', 'Cl. 106', 'AutoNorte', 'Norte 3', 'FASE I');
INSERT INTO estaciones VALUES (135, '21279', '2204', 'Pepe Sierra', 'AutoNorte', 'Norte 2', 'FASE I');
INSERT INTO estaciones VALUES (136, '21282', '2202', 'Cl. 127', 'AutoNorte', 'Norte 2', 'FASE I');
INSERT INTO estaciones VALUES (137, '21284', '2201', 'Prado', 'AutoNorte', 'Norte 2', 'FASE I');
INSERT INTO estaciones VALUES (138, '21289', '1021', 'Calle 76 - Cra. 7', 'Carrera 7', 'Carrera 7 Norte', 'FASE III');
INSERT INTO estaciones VALUES (139, '21289', '1013', 'Calle 81 - Cra. 7', 'Carrera 7', 'Carrera 7 Norte', 'FASE III');
INSERT INTO estaciones VALUES (140, '21303', '1012', 'Calle 92 - Cra. 7', 'Carrera 7', 'Carrera 7 Norte', 'FASE III');
INSERT INTO estaciones VALUES (141, '21305', '1103', 'Calle 94 - Cra. 7', 'Carrera 7', 'Carrera 7', 'FASE III');
INSERT INTO estaciones VALUES (142, '21310', '1011', 'Portal Calle 100', 'Carrera 7', 'Carrera 7 Norte', 'FASE III');
INSERT INTO estaciones VALUES (143, '21424', '3000', 'Portal Suba', 'Suba', 'Suba 1', 'FASE II');
INSERT INTO estaciones VALUES (144, '21428', '3002', 'Suba - Tv. 91', 'Suba', 'Suba 1', 'FASE II');
INSERT INTO estaciones VALUES (145, '21431', '3001', 'La Campi�a', 'Suba', 'Suba 1', 'FASE II');
INSERT INTO estaciones VALUES (146, '21456', '3005', 'Suba - Av. Boyac�', 'Suba', 'Suba 1', 'FASE II');
INSERT INTO estaciones VALUES (147, '21462', '3004', 'Gratamira', 'Suba', 'Suba 1', 'FASE II');
INSERT INTO estaciones VALUES (148, '21466', '3003', '21 �ngeles', 'Suba', 'Suba 1', 'FASE II');
INSERT INTO estaciones VALUES (149, '21547', '2200', 'Alcal�', 'AutoNorte', 'Norte 1', 'FASE I');
INSERT INTO estaciones VALUES (150, '21549', '2105', 'Cl. 142', 'AutoNorte', 'Norte 1', 'FASE I');
INSERT INTO estaciones VALUES (151, '21554', '1102', 'Calle 72 - Cra. 8', 'Calle 72', 'Calle 72', 'FASE III');
INSERT INTO estaciones VALUES (152, '21555', '2104', 'Cl. 146', 'AutoNorte', 'Norte 1', 'FASE I');
INSERT INTO estaciones VALUES (153, '21563', '2103', 'Mazur�n', 'AutoNorte', 'Norte 1', 'FASE I');
INSERT INTO estaciones VALUES (154, '21566', '2102', 'Cardio Infantil', 'AutoNorte', 'Norte 1', 'FASE I');
INSERT INTO estaciones VALUES (155, '21568', '2101', 'Tober�n', 'AutoNorte', 'Norte 1', 'FASE I');
INSERT INTO estaciones VALUES (156, '21609', '2000', 'Portal Norte', 'AutoNorte', 'Norte 1', 'FASE I');
INSERT INTO estaciones VALUES (157, '21609', '2502', 'C.C. Santa Fe', 'AutoNorte', 'Norte 1', 'FASE I');
INSERT INTO estaciones VALUES (158, '21609', '2001', 'C.C. Santa Fe', 'AutoNorte', 'Norte 1', 'FASE I');
INSERT INTO estaciones VALUES (159, '21895', '1018', 'Calle 53 - Cra. 7', 'Carrera 7', 'Carrera 7 Norte', 'FASE III');
INSERT INTO estaciones VALUES (160, '25144', '3012', 'Suba Calle 95', 'Suba', 'Suba 2', 'FASE II');
INSERT INTO estaciones VALUES (161, '27016', '7506', 'Estaci�n Despensa', 'Soacha', 'Soacha', 'SOACHA');
INSERT INTO estaciones VALUES (162, '27910', '7500', 'Estaci�n Terminal Soacha', 'Soacha', 'Soacha', 'SOACHA');
INSERT INTO estaciones VALUES (163, '27912', '7501', 'Estaci�n San Humberto', 'Soacha', 'Soacha', 'SOACHA');
INSERT INTO estaciones VALUES (164, '27927', '7502', 'Estaci�n Carrera 7 Soacha', 'Soacha', 'Soacha', 'SOACHA');
INSERT INTO estaciones VALUES (165, '27943', '7503', 'Estaci�n Intermedia San Mateo', 'Soacha', 'Soacha', 'SOACHA');
INSERT INTO estaciones VALUES (166, '27946', '7504', 'Estaci�n Terreros', 'Soacha', 'Soacha', 'SOACHA');
INSERT INTO estaciones VALUES (167, '27948', '7505', 'Estaci�n Le�n XIII', 'Soacha', 'Soacha', 'SOACHA');


--
-- TOC entry 3374 (class 2606 OID 17719)
-- Name: estaciones_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres; Tablespace: 
--

ALTER TABLE ONLY estaciones
    ADD CONSTRAINT estaciones_pkey PRIMARY KEY (id);


-- Completed on 2015-09-22 19:07:43 COT

--
-- PostgreSQL database dump complete
--

