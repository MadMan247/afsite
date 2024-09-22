<?php
$pages = [
  'index' => 'Home',
  'thefogiscoming' => 'The Fog is Coming',
  'merch' => 'Merch',
  'upcomingshows' => 'Upcoming Shows',
  'images' => 'Images',
  'members' => 'Members'
];

$current_page = basename($_SERVER['PHP_SELF'], '.html');
?>

<nav>
  <ul>
    <?php foreach ($pages as $file => $title): ?>
    <li class="<?= ($current_page == $file) ? 'active' : '' ?>">
      <a href="<?= $file ?>.html"><?= $title ?></a>
    </li>
    <?php endforeach; ?>
  </ul>
</nav>

