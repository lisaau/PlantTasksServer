--
-- PostgreSQL database dump
--

-- Dumped from database version 12.2
-- Dumped by pg_dump version 12.2

SET statement_timeout = 0;
SET lock_timeout = 0;
SET idle_in_transaction_session_timeout = 0;
SET client_encoding = 'UTF8';
SET standard_conforming_strings = on;
SELECT pg_catalog.set_config('search_path', '', false);
SET check_function_bodies = false;
SET xmloption = content;
SET client_min_messages = warning;
SET row_security = off;

SET default_tablespace = '';

SET default_table_access_method = heap;

--
-- Name: plants; Type: TABLE; Schema: public; Owner: tpl619_2
--

CREATE TABLE public.plants (
    id integer NOT NULL,
    name text NOT NULL,
    species text NOT NULL,
    notes text,
    image text
);


ALTER TABLE public.plants OWNER TO tpl619_2;

--
-- Name: plants_id_seq; Type: SEQUENCE; Schema: public; Owner: tpl619_2
--

CREATE SEQUENCE public.plants_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE public.plants_id_seq OWNER TO tpl619_2;

--
-- Name: plants_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: tpl619_2
--

ALTER SEQUENCE public.plants_id_seq OWNED BY public.plants.id;


--
-- Name: plants id; Type: DEFAULT; Schema: public; Owner: tpl619_2
--

ALTER TABLE ONLY public.plants ALTER COLUMN id SET DEFAULT nextval('public.plants_id_seq'::regclass);


--
-- Data for Name: plants; Type: TABLE DATA; Schema: public; Owner: tpl619_2
--

COPY public.plants (id, name, species, notes, image) FROM stdin;
1	Planty	Air Plant	Taking care of Planty for Kim	\N
2	Planty 2	Green Onion	Tastes delicious	\N
\.


--
-- Name: plants_id_seq; Type: SEQUENCE SET; Schema: public; Owner: tpl619_2
--

SELECT pg_catalog.setval('public.plants_id_seq', 6, true);


--
-- Name: plants plants_pkey; Type: CONSTRAINT; Schema: public; Owner: tpl619_2
--

ALTER TABLE ONLY public.plants
    ADD CONSTRAINT plants_pkey PRIMARY KEY (id);


--
-- PostgreSQL database dump complete
--

