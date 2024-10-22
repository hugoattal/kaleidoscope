<template>
    <div class="playbar">
        <div class="cursor" />
        <div class="remaining">
            <span>1:08</span> restant
        </div>
    </div>
</template>

<script setup lang="ts">

</script>

<style scoped>
.playbar {
    background: var(--fw-color-background-deep);
    border-radius: var(--fw-radius-m);
    width: 100%;
    border: 1px solid var(--fw-color-background-litest);
    height: 20px;
    margin-top: var(--fw-length-xs);
    position: relative;

    .cursor {
        width: 60%;
        border-radius: var(--fw-radius-m);
        height: 100%;
        background: linear-gradient(90deg, #ff0004, #fcfa01);
        box-shadow: 0 0 8px #f29200;
    }

    .remaining {
        position: absolute;
        right: 0;
        top: -18px;
        font-size: var(--fw-font-size-xs);
        color: var(--fw-color-content-lite);
    }
}
</style>
