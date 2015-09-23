--
-- PostgreSQL database dump
--

-- Dumped from database version 9.4.4
-- Dumped by pg_dump version 9.4.0
-- Started on 2015-09-22 19:14:10 COT

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
-- TOC entry 189 (class 1259 OID 17714)
-- Name: periodos; Type: TABLE; Schema: public; Owner: postgres; Tablespace: 
--

CREATE TABLE periodos (
    periodo character varying(14) NOT NULL,
    hora_inicio character varying(8) NOT NULL,
    hora_fin character varying(8) NOT NULL,
    duracion character varying(8) NOT NULL,
    horas numeric(6,5) NOT NULL,
    factor_hora_mas_cargada numeric(6,5) NOT NULL,
    inicio_hora_mas_cargada character varying(8) NOT NULL
);


ALTER TABLE periodos OWNER TO postgres;

--
-- TOC entry 3491 (class 0 OID 17714)
-- Dependencies: 189
-- Data for Name: periodos; Type: TABLE DATA; Schema: public; Owner: postgres
--

INSERT INTO periodos VALUES ('01_Noc', '00:00:00', '05:29:59', '05:29:59', 5.49970, 5.24500, '04:30:00');
INSERT INTO periodos VALUES ('02_Pun_Man', '05:30:00', '07:44:59', '02:14:59', 2.24970, 1.14800, '06:15:00');
INSERT INTO periodos VALUES ('03_Tra_Pun_Man', '07:45:00', '09:29:59', '01:44:59', 1.74970, 1.12300, '07:45:00');
INSERT INTO periodos VALUES ('04_Valle', '09:30:00', '14:44:59', '05:14:59', 5.24970, 1.07500, '12:15:00');
INSERT INTO periodos VALUES ('05_Tra_Pun_Tar', '14:45:00', '16:29:59', '01:44:59', 1.74970, 1.07800, '15:30:00');
INSERT INTO periodos VALUES ('06_Pun_Tar', '16:30:00', '18:44:59', '02:14:59', 2.24970, 1.18200, '17:00:00');
INSERT INTO periodos VALUES ('07_Pre_Noc', '18:45:00', '23:59:59', '05:14:59', 5.24970, 1.98700, '18:45:00');


--
-- TOC entry 3374 (class 2606 OID 17725)
-- Name: periodos_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres; Tablespace: 
--

ALTER TABLE ONLY periodos
    ADD CONSTRAINT periodos_pkey PRIMARY KEY (periodo);


-- Completed on 2015-09-22 19:14:10 COT

--
-- PostgreSQL database dump complete
--

