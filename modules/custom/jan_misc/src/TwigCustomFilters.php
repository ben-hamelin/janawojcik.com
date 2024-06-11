<?php

declare(strict_types = 1);

namespace Drupal\jan_misc;

use Twig\Extension\AbstractExtension;
use Twig\TwigFilter;

/**
 * Class DefaultService.
 *
 * @package Drupal\jan_misc
 */
class TwigCustomFilters extends AbstractExtension {

  /**
   * @return \Twig\TwigFilter[]
   */
  public function getFilters(): array
  {
    return [
      new TwigFilter('remove_comments', [$this, 'removeComments']),
      new TwigFilter('format_phone', [$this, 'formatPhone']),
    ];
  }

  /**
   * Strip out comments.
   */
  public function removeComments(string $input): string {

    if(is_string($input)){
        return preg_replace('/<!--(.|\s)*?-->/', '',$input);
    }
    elseif(is_object($input) && method_exists($input,'__toString')){
        return preg_replace('/<!--(.|\s)*?-->/', '',$input->__toString());
    }
    else{
        return $input;
    }
  }

  /**
   * Output a phone number in readable format.
   */
  public function formatPhone(string $phoneNumber): string {
    $phoneNumber = preg_replace('/[^0-9]/','',$phoneNumber);

    if(strlen($phoneNumber) > 10) {
      $countryCode = substr($phoneNumber, 0, strlen($phoneNumber)-10);
      $areaCode = substr($phoneNumber, -10, 3);
      $nextThree = substr($phoneNumber, -7, 3);
      $lastFour = substr($phoneNumber, -4, 4);

      $phoneNumber = '+'.$countryCode.' ('.$areaCode.') '.$nextThree.'-'.$lastFour;
    }
    else if(strlen($phoneNumber) == 10) {
      $areaCode = substr($phoneNumber, 0, 3);
      $nextThree = substr($phoneNumber, 3, 3);
      $lastFour = substr($phoneNumber, 6, 4);

      $phoneNumber = '('.$areaCode.') '.$nextThree.'-'.$lastFour;
    }
    else if(strlen($phoneNumber) == 7) {
      $nextThree = substr($phoneNumber, 0, 3);
      $lastFour = substr($phoneNumber, 3, 4);

      $phoneNumber = $nextThree.'-'.$lastFour;
    }

    return $phoneNumber;
  }

}
