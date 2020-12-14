<template>
    <Container>
        <Header></Header>
        <router-view></router-view>
    </Container>
</template>

<script>
import Container from './styles/Container';
import Header from './components/Header.vue';

export default {
    name: 'Node',
    components: {
        Container,
        Header
    }
}
</script>